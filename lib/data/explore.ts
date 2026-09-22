export interface ExploreCard {
  href: string;
  title: string;
  description: string;
}

export const exploreCards: ExploreCard[] = [
  {
    href: "/problem",
    title: "The Problem",
    description: "Why manual, crewed cleanup can't keep up with a spreading spill.",
  },
  {
    href: "/how-it-works",
    title: "How It Works",
    description: "The 5-stage AI pipeline — perceive, predict, decide, act, advise — plus a live simulator.",
  },
  {
    href: "/prototype",
    title: "The Prototype",
    description: "The physical boat, magnetic oleophilic sheets, and sensor suite. Built, not just designed.",
  },
  {
    href: "/impact",
    title: "Impact",
    description: "Real model accuracy, the business case, and why biodiversity is the point.",
  },
  {
    href: "/roadmap",
    title: "Roadmap",
    description: "From calibrating the sensors already on the boat to coordinating a swarm.",
  },
];
