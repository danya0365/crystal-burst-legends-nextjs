import { MissionsView } from "@/src/presentation/components/missions/MissionsView";
import { createServerMissionsPresenter } from "@/src/presentation/presenters/missions/MissionsPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Missions | Crystal Burst Legends",
  description: "Complete daily and weekly missions for rewards",
};

export default async function MissionsPage() {
  const presenter = createServerMissionsPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <MissionsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading missions:", error);
    return <MissionsView />;
  }
}
