// Single source of truth for navigation, used by the header, footer and resources hub.

export type NavLink = { href: string; label: string; blurb?: string };
export type NavGroup = { label: string; href: string; links: NavLink[] };

export const NAV_GROUPS: NavGroup[] = [
  {
    label: "Prepare",
    href: "/interview",
    links: [
      { href: "/interview", label: "Mock interview", blurb: "Questions built from a real advert, with marked feedback" },
      { href: "/practice", label: "Practice tests", blurb: "Situational judgement and reasoning, with explanations" },
      { href: "/tests", label: "Assessment replicas", blurb: "Employer-style tests with the real format and timing" },
      { href: "/mock", label: "Firm mock processes", blurb: "Run a firm's stages in its real order" },
      { href: "/review", label: "Statement review", blurb: "Feedback on your personal statement or answers" },
      { href: "/cv", label: "CV checker", blurb: "Feedback on your CV for degree apprenticeship applications" },
    ],
  },
  {
    label: "My applications",
    href: "/tracker",
    links: [
      { href: "/tracker", label: "Application tracker", blurb: "Employers, stages and closing dates" },
      { href: "/stories", label: "Stories bank", blurb: "Reusable STAR examples" },
      { href: "/progress", label: "Progress", blurb: "Scores, STAR coverage and past interviews" },
    ],
  },
  {
    label: "Learn",
    href: "/learn",
    links: [
      { href: "/finance", label: "Finance hub", blurb: "Banks and accountancy: who hires, when, and myths checked" },
      { href: "/sectors", label: "Sector guides", blurb: "What changes between tech, engineering, finance and more" },
      { href: "/guide", label: "Process guide", blurb: "What happens at each stage" },
      { href: "/tips", label: "Tips", blurb: "Tests, video interviews and assessment centres" },
      { href: "/timeline", label: "Timeline", blurb: "When to do what" },
      { href: "/employers", label: "Employers", blurb: "A starting list of who recruits" },
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
