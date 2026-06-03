import type { Metadata } from "next";
import RoadTripPageClient from "./RoadTripPageClient";

export const metadata: Metadata = {
  title: "Road Trip | Zach Krasner",
  description:
    "The year of travel leading up to our wedding. 37 states. 13 national parks. One truck.",
  alternates: { canonical: "https://zkrasner.com/roadtrip" },
  openGraph: {
    title: "Road Trip | Zach Krasner",
    description:
      "The year of travel leading up to our wedding. 37 states. 13 national parks. One truck.",
    url: "https://zkrasner.com/roadtrip",
    siteName: "Zach Krasner",
    type: "website",
  },
};

export default function RoadTripPage() {
  return <RoadTripPageClient />;
}
