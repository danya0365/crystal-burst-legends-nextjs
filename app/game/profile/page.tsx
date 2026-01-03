import { ProfileView } from "@/src/presentation/components/profile/ProfileView";
import { createServerProfilePresenter } from "@/src/presentation/presenters/profile/ProfilePresenterServerFactory";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Profile | Crystal Burst Legends",
  description: "Your player profile",
};

export default async function ProfilePage() {
  const presenter = createServerProfilePresenter();

  try {
    const viewModel = await presenter.getViewModel();
    return <ProfileView initialViewModel={viewModel} />;
  } catch (error) {
    console.error("Error loading profile:", error);
    return <ProfileView />;
  }
}
