import { HomeView } from "@/src/presentation/components/home/HomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crystal Burst Legends",
  description: "Gacha RPG Game",
};

export default function GameHomePage() {
  return <HomeView />;
}
