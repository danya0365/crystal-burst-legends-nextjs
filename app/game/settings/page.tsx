import { SettingsView } from "@/src/presentation/components/settings/SettingsView";
import { createServerSettingsPresenter } from "@/src/presentation/presenters/settings/SettingsPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Settings | Crystal Burst Legends",
  description: "Game settings and options",
};

export default async function SettingsPage() {
  const presenter = createServerSettingsPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <SettingsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading settings:", error);
    return <SettingsView />;
  }
}
