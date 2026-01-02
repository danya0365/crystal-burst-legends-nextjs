import { CharactersView } from "@/src/presentation/components/characters/CharactersView";
import { createServerCharactersPresenter } from "@/src/presentation/presenters/characters/CharactersPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Characters | Crystal Burst Legends",
  description: "Manage and upgrade your characters in Crystal Burst Legends",
};

export default async function CharactersPage() {
  const presenter = createServerCharactersPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <CharactersView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading characters:", error);
    return <CharactersView />;
  }
}
