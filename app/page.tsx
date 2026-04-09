"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import { type Locale, t } from "@/lib/utils";

export default function LandingPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const { isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isSignedIn) {
      router.push("/onboarding");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <Navbar locale={locale} onLocaleChange={setLocale} />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] rounded-full bg-green-500/5 dark:bg-green-500/10 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
          {/* Eyebrow */}
          <span className="text-sm text-zinc-500 dark:text-zinc-400 tracking-wide">
            {t(locale, "sustainable")}
          </span>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white leading-tight tracking-tighter">
            {t(locale, "tagline")}
          </h1>

          {/* Subtext */}
          <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed">
            {t(locale, "subtext")}
          </p>

          {/* CTA */}
          <button
            onClick={handleGetStarted}
            className="mt-2 px-8 py-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-semibold text-lg hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
          >
            {t(locale, "getStarted")}
          </button>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            {[
              { label: t(locale, "aiPowered"), color: "blue" },
              { label: t(locale, "nearbyDeals"), color: "green" },
              { label: t(locale, "zeroWaste"), color: "green" },
            ].map((pill) => (
              <span
                key={pill.label}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border ${
                  pill.color === "blue"
                    ? "border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50"
                    : "border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/50"
                }`}
              >
                {pill.label}
              </span>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}