import { EventsView } from "@/src/presentation/components/events/EventsView";
import { createServerEventsPresenter } from "@/src/presentation/presenters/events/EventsPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Events | Crystal Burst Legends",
  description: "Limited-time events and special rewards",
};

export default async function EventsPage() {
  const presenter = createServerEventsPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <EventsView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading events:", error);
    return <EventsView />;
  }
}
