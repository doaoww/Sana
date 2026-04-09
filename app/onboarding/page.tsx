"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import RoleSelector from "@/components/RoleSelector";
import { type Locale } from "@/lib/utils";

export default function OnboardingPage() {
  const [locale, setLocale] = useState<Locale>("en");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const handleRoleSelect = async (role: "market" | "user") => {
    if (!user) return;
    setLoading(true);
    try {
      await user.update({
        unsafeMetadata: { role },
      });
      await user.reload();
      router.replace(role === "market" ? "/dashboard/market" : "/dashboard/user");
    } catch (err) {
      console.error("Failed to save role:", err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col">
      <Navbar locale={locale} onLocaleChange={setLocale} />
      <main className="flex-1 flex items-center justify-center py-16">
        <RoleSelector
          locale={locale}
          onSelect={handleRoleSelect}
          loading={loading}
        />
      </main>
    </div>
  );
}