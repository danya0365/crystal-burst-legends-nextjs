import { SummonView } from "@/src/presentation/components/summon/SummonView";
import { createServerSummonPresenter } from "@/src/presentation/presenters/summon/SummonPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Summon | Crystal Burst Legends",
  description: "Summon new characters in Crystal Burst Legends",
};

export default async function SummonPage() {
  const presenter = createServerSummonPresenter();
  try {
    const viewModel = await presenter.getViewModel();
    return <SummonView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading summon:", error);
    return <SummonView />;
  }
}
