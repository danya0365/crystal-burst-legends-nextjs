import { StoryView } from "@/src/presentation/components/story/StoryView";
import { createServerStoryPresenter } from "@/src/presentation/presenters/story/StoryPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Story Mode | Crystal Burst Legends",
  description: "Battle through epic story chapters in Crystal Burst Legends",
};

export default async function StoryPage() {
  const presenter = createServerStoryPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <StoryView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading story:", error);
    return <StoryView />;
  }
}
