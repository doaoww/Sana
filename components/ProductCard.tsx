"use client";

import { Clock, MapPin } from "lucide-react";
import { type Product, type Locale, t, formatPrice, formatDistance, formatExpiry } from "@/lib/utils";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  onTakeMeThere?: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  isVendorView?: boolean;
}

export default function ProductCard({
  product,
  locale,
  onTakeMeThere,
  onEdit,
  onDelete,
  isVendorView = false,
}: ProductCardProps) {
  const expiry = formatExpiry(product.expiry_time);
  const isExpiringSoon = expiry.includes("m left") || expiry.includes("h ");

  return (
    <div className="flex flex-col rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-sm hover:shadow-md transition-all">
      {/* Image */}
      <div className="relative w-full h-44 bg-zinc-100 dark:bg-zinc-800">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🍱
          </div>
        )}
        {/* Expiry badge */}
        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1 ${
            isExpiringSoon
              ? "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
          }`}
        >
          <Clock className="w-3 h-3" />
          {expiry}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-4 flex-1">
        <div>
          <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
            {product.category}
          </span>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white mt-0.5">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-zinc-900 dark:text-white">
            {formatPrice(product.discounted_price)}
          </span>
          <span className="text-sm text-zinc-400 line-through">
            {formatPrice(product.original_price)}
          </span>
          <span className="ml-auto text-xs font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 px-2 py-0.5 rounded-full">
            {Math.round(
              ((product.original_price - product.discounted_price) /
                product.original_price) *
                100
            )}
            % off
          </span>
        </div>

        {/* Distance + quantity */}
        {!isVendorView && (
          <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
            {product.distance !== undefined && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {formatDistance(product.distance)}
              </span>
            )}
            <span>Qty: {product.quantity}</span>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-2 flex gap-2">
          {isVendorView ? (
            <>
              <button
                onClick={() => onEdit?.(product)}
                className="flex-1 py-2 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition-colors"
              >
                {t(locale, "edit")}
              </button>
              <button
                onClick={() => onDelete?.(product)}
                className="flex-1 py-2 rounded-lg text-sm font-medium bg-red-50 dark:bg-red-950 hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400 transition-colors"
              >
                {t(locale, "delete")}
              </button>
            </>
          ) : (
            <button
              onClick={() => onTakeMeThere?.(product)}
              className="flex-1 py-2 rounded-lg text-sm font-medium bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
            >
              {t(locale, "takeMeThere")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}