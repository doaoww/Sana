"use client";

import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { type Locale } from "@/lib/utils";

interface NavbarProps {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
}

export default function Navbar({ locale, onLocaleChange }: NavbarProps) {
  const { isSignedIn, user } = useUser();
  const locales: Locale[] = ["en", "ru", "kk"];

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tighter text-zinc-900 dark:text-white">
          SANA
        </span>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-1">
            {locales.map((l) => (
              <button
                key={l}
                onClick={() => onLocaleChange(l)}
                className={`px-2 py-1 rounded-md text-xs font-medium transition-colors uppercase ${
                  locale === l
                    ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <ThemeToggle />
          {isSignedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-zinc-600 dark:text-zinc-400 hidden sm:block">
                {user?.firstName ?? user?.emailAddresses[0]?.emailAddress}
              </span>
              <SignOutButton>
                <button className="text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition-colors">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          ) : (
            <SignInButton mode="modal">
              <button className="text-sm px-3 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors font-medium">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}