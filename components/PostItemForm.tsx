"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import { type Locale, t } from "@/lib/utils";

interface PostItemFormProps {
  locale: Locale;
  onSuccess: () => void;
}

const CATEGORIES = ["Meal", "Bakery", "Grocery", "Beverage"];

export default function PostItemForm({ locale, onSuccess }: PostItemFormProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Meal",
    original_price: "",
    discounted_price: "",
    quantity: "",
    expiry_time: "",
    description: "",
    lat: "43.2220",
    lng: "76.8512",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const locationWKT = `POINT(${form.lng} ${form.lat})`;

    const { error } = await supabase.from("products").insert({
      vendor_id: user.id,
      vendor_name: user.firstName ?? user.emailAddresses[0]?.emailAddress,
      name: form.name,
      category: form.category,
      original_price: parseFloat(form.original_price),
      discounted_price: parseFloat(form.discounted_price),
      quantity: parseInt(form.quantity),
      expiry_time: form.expiry_time,
      description: form.description,
      location: locationWKT,
    });

    setLoading(false);

    if (!error) {
      setForm({
        name: "",
        category: "Meal",
        original_price: "",
        discounted_price: "",
        quantity: "",
        expiry_time: "",
        description: "",
        lat: "43.2220",
        lng: "76.8512",
      });
      onSuccess();
    } else {
      console.error(error);
      alert("Failed to post item. Check console.");
    }
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:focus:ring-zinc-500 placeholder:text-zinc-400";

  const labelClass = "block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* Name */}
      <div className="sm:col-span-2">
        <label className={labelClass}>{t(locale, "itemName")}</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="e.g. Chicken Pilaf"
          className={inputClass}
        />
      </div>

      {/* Category */}
      <div>
        <label className={labelClass}>{t(locale, "category")}</label>
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Quantity */}
      <div>
        <label className={labelClass}>{t(locale, "quantity")}</label>
        <input
          name="quantity"
          type="number"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          required
          placeholder="e.g. 10"
          className={inputClass}
        />
      </div>

      {/* Original Price */}
      <div>
        <label className={labelClass}>{t(locale, "originalPrice")}</label>
        <input
          name="original_price"
          type="number"
          min="0"
          value={form.original_price}
          onChange={handleChange}
          required
          placeholder="e.g. 2500"
          className={inputClass}
        />
      </div>

      {/* Discounted Price */}
      <div>
        <label className={labelClass}>{t(locale, "discountedPrice")}</label>
        <input
          name="discounted_price"
          type="number"
          min="0"
          value={form.discounted_price}
          onChange={handleChange}
          required
          placeholder="e.g. 1200"
          className={inputClass}
        />
      </div>

      {/* Expiry Time */}
      <div className="sm:col-span-2">
        <label className={labelClass}>{t(locale, "expiryTime")}</label>
        <input
          name="expiry_time"
          type="datetime-local"
          value={form.expiry_time}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Location */}
      <div>
        <label className={labelClass}>Latitude</label>
        <input
          name="lat"
          value={form.lat}
          onChange={handleChange}
          placeholder="43.2220"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Longitude</label>
        <input
          name="lng"
          value={form.lng}
          onChange={handleChange}
          placeholder="76.8512"
          className={inputClass}
        />
      </div>

      {/* Description */}
      <div className="sm:col-span-2">
        <label className={labelClass}>{t(locale, "description")}</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Describe the item..."
          className={inputClass}
        />
      </div>

      {/* Submit */}
      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {loading ? t(locale, "loading") : t(locale, "submit")}
        </button>
      </div>
    </form>
  );
}