"use client";

import { useProfileStore } from "@/src/infrastructure/stores/useProfileStore";
import { MainLayout } from "@/src/presentation/components/layout/MainLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { hasProfile } = useProfileStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !hasProfile) {
      router.replace("/");
    }
  }, [mounted, hasProfile, router]);

  if (!mounted) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        </div>
      </MainLayout>
    );
  }

  if (!hasProfile) {
    return null;
  }

  return <>{children}</>;
}
