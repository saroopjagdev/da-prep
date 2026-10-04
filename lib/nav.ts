// Single source of truth for navigation, used by the header, footer and resources hub.

export type NavLink = { href: string; label: string; blurb?: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Prepare",
    href: "/interview",
    links: [
      { href: "/interview", label: "Mock interview", blurb: "Questions built from a real advert, with marked feedback" },
      { href: "/practice", label: "Practice tests", blurb: "General practice with explanations, plus employer-style replicas with real formats and timings" },
      { href: "/mock", label: "Firm mock processes", blurb: "Run a firm's stages in its real order" },
      { href: "/review", label: "Written feedback", blurb: "Your personal statement, application answers or CV" },
    ],
  },
  {
    label: "Opportunities",
    href: "/opportunities",
    links: [
      { href: "/opportunities", label: "All opportunities", blurb: "Who is open now, opening soon or closed, across every sector" },
      { href: "/opportunities?guides=1", label: "Employer guides", blurb: "Process, tests and interview for each employer we have researched" },
      { href: "/opportunities?mine=1", label: "My list", blurb: "Track where you have applied, your stage, notes and closing dates" },
    ],
  },
  {
    label: "My prep",
    href: "/stories",
    links: [
      { href: "/stories", label: "Stories bank", blurb: "Reusable STAR examples" },
      { href: "/progress", label: "Progress", blurb: "Scores, STAR coverage and past interviews" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    links: [
      { href: "/sectors", label: "Sector guides", blurb: "What changes between tech, engineering, finance and more" },
      { href: "/guide", label: "Process guide", blurb: "What happens at each stage" },
      { href: "/tips", label: "Tips", blurb: "Tests, video interviews and assessment centres" },
      { href: "/timeline", label: "Timeline", blurb: "When to do what" },
      { href: "/faq", label: "FAQ", blurb: "Common questions answered" },
    ],
  },
];

export const LEGAL_LINKS: NavLink[] = [
  { href: "/pricing", label: "Plans" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
];
