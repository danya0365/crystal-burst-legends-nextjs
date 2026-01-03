import { ProfileSetupView } from "@/src/presentation/components/profile-setup/ProfileSetupView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Welcome | Crystal Burst Legends",
  description: "Create your hero and start your adventure",
};

export default function WelcomePage() {
  return <ProfileSetupView />;
}
