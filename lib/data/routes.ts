export interface SiteRoute {
  href: string;
  label: string;
}

export const siteRoutes: SiteRoute[] = [
  { href: "/", label: "Home" },
  { href: "/problem", label: "Problem" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/prototype", label: "Prototype" },
  { href: "/impact", label: "Impact" },
  { href: "/roadmap", label: "Roadmap" },
];
