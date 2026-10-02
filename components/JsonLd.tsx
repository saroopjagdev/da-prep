import { serialiseLd } from "@/lib/seo";

/** Renders structured data for search engines. Server component: nothing here runs in the browser. */
export default function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialiseLd(data) }} />;
}
