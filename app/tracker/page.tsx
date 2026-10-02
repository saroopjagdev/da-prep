import { FIRMS } from "@/lib/firms";
import { trackerFirms } from "@/lib/tracker";
import TrackerApp from "./TrackerApp";

export default function TrackerPage() {
  return <TrackerApp firms={trackerFirms(FIRMS.filter((f) => f.slug !== "civil-service-fast-track"))} />;
}
