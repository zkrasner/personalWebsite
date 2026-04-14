import type { Project } from "./types";

export const shoregrounds: Project = {
  slug: "shoregrounds",
  title: "ShoreGrounds",
  tagline:
    "A map of independent coffee shops and roasters on Boston's North Shore",
  description:
    "A personal side project born from weekend coffee trips with my wife and newborn son. A single-page map that surfaces independent coffee shops, roasters, and bean sources on the North Shore of Boston, intended to help others support local over big coffee.",

  type: "side",
  status: "live",
  startDate: "2026-01",

  role: "Solo",
  teamSize: 1,

  coverImage: "/projects/shoregrounds.png",

  tech: {
    frontend: ["React", "TypeScript", "Vite", "Mapbox GL"],
    infrastructure: ["Firebase Hosting", "Firebase Analytics"],
    testing: ["Vitest"],
    other: ["GitHub Actions"],
  },

  problem: [
    "My wife and I wanted to stop buying Keurig cups, cut back on plastic waste, and support more local businesses. We also had a newborn son and needed low-effort reasons to get out of the house during the winter.",
    "Good independent coffee shops on the North Shore of Boston are scattered and hard to discover. There was no single place to see them all, let alone find which ones sold beans, had good reviews, or were worth a weekend drive.",
  ],

  approach: [
    "Built a single-page map showing every independent coffee shop between Boston and the New Hampshire border. Each pin surfaces shop details, social links, and direct Google Maps directions.",
    "Sourced shop data (ratings, addresses, hours, coordinates) using the Google Places API during development, then hard-coded the results in the frontend for fast load times, since the shop list rarely changes.",
    "Kept the runtime stack intentionally minimal: Vite and React, no SSR or routing. Chose Mapbox over Google Maps because it allows much richer map styling.",
    "Hosted on Firebase so I could stand it up fast and iterate on my own time.",
  ],

  outcomes: [
    "First iteration shipped and live at shoregrounds.com.",
    "My wife and I use it ourselves every weekend to find new shops to visit and beans to try at home.",
  ],

  sections: [
    {
      heading: "What's next",
      body: "Longer term I'd like to grow this into a small community: a newsletter, partnerships with local roasters for giveaways or a monthly bean club, and an AI chatbot that asks about flavor preferences and recommends a local roaster and specific bean to match.",
    },
  ],

  links: [{ label: "Live site", url: "https://shoregrounds.com" }],
};
