/**
 * Game Home Page
 * Server Component for SEO with Home presenter pattern
 */

import { HomeView } from "@/src/presentation/components/home/HomeView";
import { createServerHomePresenter } from "@/src/presentation/presenters/home/HomePresenterServerFactory";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const presenter = createServerHomePresenter();
  const metadata = presenter.getMetadata();

  return {
    title: metadata.title,
    description: metadata.description,
  };
}

export default async function GameHomePage() {
  const presenter = createServerHomePresenter();
  const initialViewModel = await presenter.getViewModel();

  return <HomeView initialViewModel={initialViewModel} />;
}
