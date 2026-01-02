import { MailView } from "@/src/presentation/components/mail/MailView";
import { createServerMailPresenter } from "@/src/presentation/presenters/mail/MailPresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mail | Crystal Burst Legends",
  description: "Your inbox and rewards",
};

export default async function MailPage() {
  const presenter = createServerMailPresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <MailView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading mail:", error);
    return <MailView />;
  }
}
