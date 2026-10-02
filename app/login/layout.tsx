// Personal tool: keep it out of search results (robots.txt alone does not stop a linked page being indexed).
export const metadata = { title: "Account", robots: { index: false, follow: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
