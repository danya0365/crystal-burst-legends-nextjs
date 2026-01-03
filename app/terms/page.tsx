import { TermsView } from "@/src/presentation/components/legal/TermsView";
import { createServerLegalPresenter } from "@/src/presentation/presenters/legal/LegalPresenterServerFactory";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerLegalPresenter();
  return presenter.generateTermsMetadata();
}

export default async function TermsPage() {
  const presenter = createServerLegalPresenter();

  try {
    const viewModel = await presenter.getTermsViewModel();
    return <TermsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching terms data:", error);

    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Error</h1>
          <p className="text-[var(--text-muted)] mb-4">Could not load content</p>
          <Link href="/" className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg">
            Go Home
          </Link>
        </div>
      </div>
    );
  }
}
