import { SocialView } from "@/src/presentation/components/social/SocialView";
import { createServerSocialPresenter } from "@/src/presentation/presenters/social/SocialPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Social | Crystal Burst Legends",
  description: "Friends & social features",
};

export default async function SocialPage() {
  const presenter = createServerSocialPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <SocialView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading social:", error);
    return <SocialView />;
  }
}
