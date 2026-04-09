"use client";

import { X, ExternalLink } from "lucide-react";
import { type Product, type Locale, t } from "@/lib/utils";

interface MapModalProps {
  product: Product | null;
  userLocation: { lat: number; lng: number } | null;
  locale: Locale;
  onClose: () => void;
}

export default function MapModal({
  product,
  userLocation,
  locale,
  onClose,
}: MapModalProps) {
  if (!product) return null;

  const parsePoint = (
    location: Product["location"]
  ): { lat: number; lng: number } | null => {
    if (!location) return null;
    if (typeof location === "object" && "lat" in location && "lng" in location) {
      return { lat: Number(location.lat), lng: Number(location.lng) };
    }
    if (typeof location === "string") {
      const match = location.match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/i);
      if (match) {
        return { lng: Number(match[1]), lat: Number(match[2]) };
      }
    }
    return null;
  };

  const vendorPoint = parsePoint(product.location);
  const vendorLat = vendorPoint?.lat ?? 43.222;
  const vendorLng = vendorPoint?.lng ?? 76.8512;
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY;

  // TODO: Replace Google Maps with 2GIS Embed API for Kazakhstan market — see docs.2gis.com
  const embedUrl =
    userLocation && mapsKey
      ? `https://www.google.com/maps/embed/v1/directions?key=${mapsKey}&origin=${userLocation.lat},${userLocation.lng}&destination=${vendorLat},${vendorLng}&mode=walking`
      : null;

  const googleMapsUrl = userLocation
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${vendorLat},${vendorLng}&travelmode=walking`
    : `https://www.google.com/maps/search/?api=1&query=${vendorLat},${vendorLng}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-white">
            {product.name}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        {embedUrl ? (
          <iframe
            title="Walking directions to vendor"
            src={embedUrl}
            className="w-full h-72"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-72 bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-2 text-zinc-400">
            <span className="text-4xl">🗺️</span>
            <p className="text-sm text-center px-4">
              Location preview unavailable. Use the button below to open directions.
            </p>
          </div>
        )}

        <div className="px-5 py-4 flex flex-col gap-3">
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-white">
              {t(locale, "vendorInfo")}
            </p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
              {product.vendor_name ?? "Vendor"}
            </p>
          </div>

          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t(locale, "openInMaps")}
          </a>
        </div>
      </div>
    </div>
  );
}
