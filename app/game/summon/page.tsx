import { SummonView } from "@/src/presentation/components/summon/SummonView";
import { createServerGachaPresenter } from "@/src/presentation/presenters/gacha/GachaPresenterServerFactory";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerGachaPresenter();
  return presenter.generateMetadata();
}

export default async function SummonPage() {
  const presenter = createServerGachaPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <SummonView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching summon data:", error);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Error</h1>
          <p className="text-[var(--text-muted)] mb-4">Could not load summon page</p>
          <Link href="/game" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg">
            Go Back
          </Link>
        </div>
      </div>
    );
  }
}
