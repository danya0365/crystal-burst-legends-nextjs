import { PvpView } from "@/src/presentation/components/pvp/PvpView";
import { createServerPvpPresenter } from "@/src/presentation/presenters/pvp/PvpPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "PVP Arena | Crystal Burst Legends",
  description: "Battle other players in Crystal Burst Legends",
};

export default async function PvpPage() {
  const presenter = createServerPvpPresenter();
  try {
    const viewModel = await presenter.getViewModel();
    return <PvpView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading PVP:", error);
    return <PvpView />;
  }
}
