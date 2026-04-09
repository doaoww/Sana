"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { type Locale, type Product, t } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import PostItemForm from "@/components/PostItemForm";
import ProductCard from "@/components/ProductCard";

export default function MarketDashboard() {
  const [locale, setLocale] = useState<Locale>("en");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  const fetchProducts = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) setProducts(data as Product[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async (product: Product) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    await supabase.from("products").delete().eq("id", product.id);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8 flex flex-col gap-10">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            {t(locale, "welcomeBack")},{" "}
            {user?.firstName ?? user?.emailAddresses[0]?.emailAddress} 👋
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
            Manage your surplus food listings below.
          </p>
        </div>

        {/* Post Item Form */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">
            {t(locale, "postItem")}
          </h2>
          <PostItemForm locale={locale} onSuccess={fetchProducts} />
        </section>

        {/* Active Listings */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            {t(locale, "yourListings")}
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl bg-zinc-100 dark:bg-zinc-800 animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <p className="text-zinc-400 text-sm">{t(locale, "noListings")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  locale={locale}
                  isVendorView
                  onDelete={handleDelete}
                  onEdit={() => alert("Edit coming soon!")}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}