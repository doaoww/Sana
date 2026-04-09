"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { type Locale, type Product, t } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import MapModal from "@/components/MapModal";
import ChatAssistant from "@/components/ChatAssistant";
import { Search } from "lucide-react";

const CATEGORIES = ["All", "Meal", "Bakery", "Grocery", "Beverage"];

export default function UserDashboard() {
  const [locale, setLocale] = useState<Locale>("en");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [radiusKm, setRadiusKm] = useState(2);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Get user location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 43.222, lng: 76.8512 }), // Default: Almaty center
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 120000 }
    );
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const lat = userLocation?.lat ?? 43.222;
      const lng = userLocation?.lng ?? 76.8512;

      const rpc = await supabase.rpc("nearby_products", {
        user_lat: lat,
        user_lng: lng,
        radius_meters: radiusKm * 1000,
      });

      if (!rpc.error && rpc.data) {
        const mapped = (rpc.data as Product[]).filter(
          (p) => category === "All" || p.category === category
        );
        setProducts(mapped);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("products")
        .select("*")
        .gt("quantity", 0)
        .gt("expiry_time", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(30);

      if (category !== "All") {
        query = query.eq("category", category);
      }

      const fallback = await query;
      if (!fallback.error && fallback.data) setProducts(fallback.data as Product[]);
      setLoading(false);
    };

    fetchProducts();
  }, [category, radiusKm, userLocation?.lat, userLocation?.lng]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-6">
        {/* Search + filters */}
        <div className="flex flex-col gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t(locale, "searchPlaceholder")}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-300 dark:focus:ring-zinc-600 placeholder:text-zinc-400"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  category === cat
                    ? "bg-zinc-900 dark:bg-white text-white dark:text-zinc-900"
                    : "bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                }`}
              >
                {cat === "All"
                  ? t(locale, "allCategories")
                  : cat === "Meal"
                  ? t(locale, "meals")
                  : cat === "Bakery"
                  ? t(locale, "bakery")
                  : cat === "Grocery"
                  ? t(locale, "grocery")
                  : t(locale, "beverage")}
              </button>
            ))}
          </div>

          {/* Distance slider */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              Radius: {radiusKm.toFixed(1)} km
            </label>
            <input
              type="range"
              min={0.5}
              max={5}
              step={0.5}
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              className="w-full accent-zinc-900 dark:accent-white"
            />
          </div>
        </div>

        {/* Listings grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400 gap-3">
            <span className="text-5xl">🍽️</span>
            <p className="text-sm">No items found. Try a different search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                onTakeMeThere={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Map Modal */}
      <MapModal
        product={selectedProduct}
        userLocation={userLocation}
        locale={locale}
        onClose={() => setSelectedProduct(null)}
      />

      {/* AI Chat */}
      <ChatAssistant locale={locale} userLocation={userLocation} />
    </div>
  );
}