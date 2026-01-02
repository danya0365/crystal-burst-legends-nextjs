import { SupportView } from "@/src/presentation/components/support/SupportView";
import { createServerSupportPresenter } from "@/src/presentation/presenters/support/SupportPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Support | Crystal Burst Legends",
  description: "Help & FAQ",
};

export default async function SupportPage() {
  const presenter = createServerSupportPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <SupportView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading support:", error);
    return <SupportView />;
  }
}
