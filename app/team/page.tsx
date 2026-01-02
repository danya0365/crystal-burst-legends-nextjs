import { TeamView } from "@/src/presentation/components/team/TeamView";
import { createServerTeamPresenter } from "@/src/presentation/presenters/team/TeamPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Team Formation | Crystal Burst Legends",
  description: "Build and manage your battle team",
};

export default async function TeamPage() {
  const presenter = createServerTeamPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <TeamView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading team:", error);
    return <TeamView />;
  }
}
