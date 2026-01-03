import { ContactView } from "@/src/presentation/components/legal/ContactView";
import { createServerLegalPresenter } from "@/src/presentation/presenters/legal/LegalPresenterServerFactory";
import type { Metadata } from "next";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerLegalPresenter();
  return presenter.generateContactMetadata();
}

export default async function ContactPage() {
  const presenter = createServerLegalPresenter();

  try {
    const viewModel = await presenter.getContactViewModel();
    return <ContactView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error fetching contact data:", error);

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
