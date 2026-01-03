import { LandingView } from "@/src/presentation/components/landing/LandingView";
import { createServerLandingPresenter } from "@/src/presentation/presenters/landing/LandingPresenterServerFactory";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerLandingPresenter();
  return presenter.generateMetadata();
}

/**
 * Landing Page - Server Component for SEO optimization
 */
export default async function LandingPage() {
  const presenter = createServerLandingPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <LandingView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching landing data:", error);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
            เกิดข้อผิดพลาด
          </h1>
          <p className="text-[var(--text-muted)] mb-4">ไม่สามารถโหลดข้อมูลได้</p>
          <Link
            href="/"
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            ลองใหม่
          </Link>
        </div>
      </div>
    );
  }
}
