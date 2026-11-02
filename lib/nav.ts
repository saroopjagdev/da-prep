// Single source of truth for navigation, used by the header, footer and resources hub.

export type NavLink = { href: string; label: string; blurb?: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Employers",
    href: "/opportunities",
    links: [
      { href: "/opportunities", label: "Opportunities tracker", blurb: "Who is open now, opening soon or closed, across every sector" },
      { href: "/deadlines", label: "Deadlines", blurb: "One page of who is open and when they close, to print or share" },
      { href: "/employers", label: "Employer guides and mocks", blurb: "Every employer's process, tests and interview, with a mock process to run where we have one" },
      { href: "/opportunities?mine=1", label: "My tracker", blurb: "Track where you have applied, your stage, notes and closing dates" },
    ],
  },
  {
    label: "Practise",
    href: "/interview",
    links: [
      { href: "/interview", label: "Mock interview", blurb: "Questions built from a real advert, with marked feedback" },
      { href: "/practice", label: "Practice tests", blurb: "General practice with explanations, plus employer-style replicas with real formats and timings" },
      { href: "/games", label: "Practice games", blurb: "Balloon, card, memory and reaction games like the ones employers use" },
      { href: "/review", label: "CV and statement review", blurb: "Marked feedback on your CV, personal statement or application answers" },
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

// The header: the places people look for first sit at the top level (Tracker, Pricing, FAQ); the rest group into two menus.
export type HeaderItem = { label: string; href: string; links?: NavLink[] };
const group = (label: string) => NAV_GROUPS.find((g) => g.label === label)!.links;
export const HEADER_ITEMS: HeaderItem[] = [
  { label: "Tracker", href: "/opportunities" },
  { label: "Practise", href: "/interview", links: group("Practise") },
  {
    label: "Learn",
    href: "/learn",
    links: [
      { href: "/employers", label: "Employer guides", blurb: "Every employer's process, tests and interview, stage by stage" },
      ...group("Learn").filter((l) => l.href !== "/faq"),
      { href: "/deadlines", label: "Deadlines", blurb: "Who is open and when they close, to print or share" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
];
