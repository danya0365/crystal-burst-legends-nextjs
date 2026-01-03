/**
 * More Page
 * Server Component for SEO with More presenter pattern
 */

import { MoreView } from "@/src/presentation/components/more/MoreView";
import { createServerMorePresenter } from "@/src/presentation/presenters/more/MorePresenterServerFactory";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerMorePresenter();
  const metadata = presenter.getMetadata();

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function MorePage() {
  const presenter = createServerMorePresenter();
  const initialViewModel = await presenter.getViewModel();

  return <MoreView initialViewModel={initialViewModel} />;
}
