import { firmQuestions } from "@/lib/application-questions";
import { FIRMS } from "@/lib/firms";
import { firmOptions } from "@/lib/firms/context";
import ReviewApp from "./ReviewApp";

export default function ReviewPage() {
  const firms = firmOptions().map((o) => ({ ...o, questions: firmQuestions(FIRMS.find((f) => f.slug === o.slug)!) }));
  return <ReviewApp firms={firms} />;
}
