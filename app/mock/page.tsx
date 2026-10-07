import { permanentRedirect } from "next/navigation";

// Mock processes now live with the employer guides, so the old index goes there.
export default function MockIndex() {
  permanentRedirect("/employers");
}
