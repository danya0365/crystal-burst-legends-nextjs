import { HomeView } from "@/src/presentation/components/home/HomeView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crystal Burst Legends - Home",
  description: "Start your journey in Crystal Burst Legends!",
};

export default function Home() {
  return <HomeView />;
}
