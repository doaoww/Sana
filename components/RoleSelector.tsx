"use client";

import { ShoppingBag, User } from "lucide-react";
import { type Locale, t } from "@/lib/utils";

interface RoleSelectorProps {
  locale: Locale;
  onSelect: (role: "market" | "user") => void;
  loading: boolean;
}

export default function RoleSelector({ locale, onSelect, loading }: RoleSelectorProps) {
  return (
    <div className="flex flex-col items-center gap-10 w-full max-w-3xl mx-auto px-4">
      <div className="text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-white tracking-tighter">
          {t(locale, "whoAreYou")}
        </h1>
        <p className="mt-3 text-zinc-500 dark:text-zinc-400">
          {t(locale, "chooseRole")}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
        {/* Vendor Card */}
        <button
          onClick={() => onSelect("market")}
          disabled={loading}
          className="group flex flex-col items-start gap-4 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-green-400 dark:hover:border-green-600 hover:scale-[1.02] transition-all text-left shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-3 rounded-xl bg-green-100 dark:bg-green-950">
            <ShoppingBag className="w-7 h-7 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {t(locale, "iAmVendor")}
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {t(locale, "vendorDesc")}
            </p>
          </div>
        </button>

        {/* Customer Card */}
        <button
          onClick={() => onSelect("user")}
          disabled={loading}
          className="group flex flex-col items-start gap-4 p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-blue-400 dark:hover:border-blue-600 hover:scale-[1.02] transition-all text-left shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950">
            <User className="w-7 h-7 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
              {t(locale, "iAmCustomer")}
            </h2>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              {t(locale, "customerDesc")}
            </p>
          </div>
        </button>
      </div>

      {loading && (
        <p className="text-sm text-zinc-400 animate-pulse">
          {t(locale, "loading")}
        </p>
      )}
    </div>
  );
}