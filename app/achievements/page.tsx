import { AchievementsView } from "@/src/presentation/components/achievements/AchievementsView";
import { createServerAchievementsPresenter } from "@/src/presentation/presenters/achievements/AchievementsPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achievements | Crystal Burst Legends",
  description: "Track your achievements and earn rewards",
};

export default async function AchievementsPage() {
  const presenter = createServerAchievementsPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <AchievementsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading achievements:", error);
    return <AchievementsView />;
  }
}
