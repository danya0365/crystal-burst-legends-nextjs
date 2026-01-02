import { MoreView } from "@/src/presentation/components/more/MoreView";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "More | Crystal Burst Legends",
  description: "Access additional features and settings",
};

export default function MorePage() {
  return <MoreView />;
}
