// Cappfinity-style verbal and critical reasoning items. Hand-written and original. The formats follow public
// descriptions (gap fill, matching, ranking statements, true/false; and five critical reasoning styles) recorded in
// docs/research/12-online-assessments.md. Every key was checked against its passage.

import type { Item, Stimulus } from "@/lib/assess/types";

type Passage = {
  id: string;
  title: string;
  body: string;
  gap: { prompt: string; options: string[]; answer: number; why: string };
  summary: { prompt: string; options: string[]; answer: number; why: string };
  // Ranking: stated, implied, not mentioned, contradicted (the correct order, most supported first).
  support: [stated: string, implied: string, notMentioned: string, contradicted: string];
  tf: { text: string; answer: 0 | 1 | 2; why: string };
};

const PASSAGES: Passage[] = [
  {
    id: "capp-v1",
    title: "Open banking",
    body:
      "Open banking lets customers allow apps to see their bank account data securely, with their permission. Since it launched in the UK in 2018, the number of users has grown steadily, and some lenders use it to check applicants' income when they apply for loans. Supporters say it increases competition by making products easier to compare. Critics argue that many customers do not fully understand what they are agreeing to share. Customers can withdraw their permission at any time, after which the app can no longer access new data.",
    gap: { prompt: "Complete the sentence so it matches the passage: Customers can ___ their permission at any time.", options: ["withdraw", "extend", "transfer", "sell"], answer: 0, why: "The passage says customers can withdraw their permission at any time." },
    summary: {
      prompt: "Which statement best summarises the passage?",
      options: [
        "Open banking lets customers share account data with apps, which brings benefits and some concerns.",
        "Open banking has been banned because customers do not understand it.",
        "Open banking is used only by lenders to check applicants' income.",
        "Open banking began in 2022 and is still being tested.",
      ],
      answer: 0,
      why: "The passage describes what open banking does, its benefits (competition, income checks) and a concern (understanding what is shared).",
    },
    support: [
      "Customers can stop an app accessing new data by withdrawing permission.",
      "Some customers may share more data than they realise.",
      "Open banking apps charge customers a monthly fee.",
      "Open banking was launched in the UK in 2021.",
    ],
    tf: { text: "Open banking has been available in the UK since 2018.", answer: 0, why: "The passage says it launched in the UK in 2018." },
  },
  {
    id: "capp-v2",
    title: "Banking hubs",
    body:
      "As more customers move to mobile banking, many banks have closed branches. To keep cash and basic services available, banks have opened shared 'banking hubs' in some towns, where staff from different banks take turns to attend on set days. Consumer groups welcome the hubs but say they open too slowly in places that have already lost their last branch. Banks argue that hubs are expensive to run and should be placed where demand is highest.",
    gap: { prompt: "Complete the sentence so it matches the passage: In banking hubs, staff from different banks ___ on set days.", options: ["take turns to attend", "work together permanently", "never attend", "train new customers"], answer: 0, why: "The passage says staff from different banks take turns to attend on set days." },
    summary: {
      prompt: "What do banks argue about banking hubs?",
      options: [
        "They are expensive and should be placed where demand is highest.",
        "They should replace mobile banking.",
        "They are cheaper to run than branches.",
        "Consumer groups should pay for them.",
      ],
      answer: 0,
      why: "The last sentence gives the banks' view: hubs are expensive and should go where demand is highest.",
    },
    support: [
      "Some towns now have shared banking hubs.",
      "Consumer groups would like hubs to open more quickly.",
      "Banking hubs offer mortgage advice.",
      "Banks say hubs are cheap to run.",
    ],
    tf: { text: "Consumer groups oppose banking hubs.", answer: 1, why: "The passage says consumer groups welcome the hubs." },
  },
  {
    id: "capp-v3",
    title: "Sustainable funds",
    body:
      "Some investment funds now exclude companies involved in activities such as coal mining or tobacco. These are often called ethical or sustainable funds. Their managers say that excluding such companies can reduce long-term risks, such as the cost of future regulation. However, a fund that excludes many companies has fewer shares to choose from, which can make its returns differ noticeably from the wider market, for better or worse. Investors are advised to read a fund's rules to see exactly what it excludes, because definitions vary between providers.",
    gap: { prompt: "Complete the sentence so it matches the passage: Because definitions vary between providers, investors should read a fund's ___.", options: ["rules", "reviews", "share price", "adverts"], answer: 0, why: "Investors are advised to read a fund's rules to see what it excludes." },
    summary: {
      prompt: "According to the passage, what is one effect of excluding many companies?",
      options: [
        "The fund's returns can differ noticeably from the wider market.",
        "The fund always performs better than the market.",
        "The fund is not allowed to invest in shares.",
        "The fund pays no fees.",
      ],
      answer: 0,
      why: "Fewer shares to choose from can make returns differ from the wider market, for better or worse.",
    },
    support: [
      "Some funds exclude tobacco companies.",
      "Two 'sustainable' funds from different providers might exclude different companies.",
      "Sustainable funds are more popular with younger investors.",
      "Excluding companies always reduces a fund's returns.",
    ],
    tf: { text: "The managers of these funds say excluding certain companies can reduce long-term risks.", answer: 0, why: "The passage says their managers say this." },
  },
  {
    id: "capp-v4",
    title: "Fernhill Bank rotations",
    body:
      "Fernhill Bank's operations apprentices complete three six-month rotations in their first eighteen months: payments, client onboarding and trade settlement. At the end of each rotation, the apprentice's line manager and a mentor from another team review their progress together. Apprentices may ask to repeat a rotation if they want more experience, but this extends the programme. After the rotations, apprentices choose a permanent team, subject to there being a vacancy.",
    gap: { prompt: "Complete the sentence so it matches the passage: Each rotation lasts ___ months.", options: ["six", "three", "eighteen", "twelve"], answer: 0, why: "There are three six-month rotations." },
    summary: {
      prompt: "Who reviews an apprentice's progress at the end of each rotation?",
      options: ["Their line manager and a mentor from another team", "Only their mentor", "The head of operations", "Other apprentices"],
      answer: 0,
      why: "The line manager and a mentor from another team review progress together.",
    },
    support: [
      "Apprentices spend time in the payments team.",
      "An apprentice might not get their first choice of permanent team.",
      "Apprentices are paid more after each rotation.",
      "Repeating a rotation shortens the programme.",
    ],
    tf: { text: "All apprentices join the trade settlement team permanently.", answer: 1, why: "Apprentices choose a permanent team after the rotations, so they do not all join trade settlement." },
  },
];

const SUPPORT_WHY = "Most supported first: stated in the passage, then implied by it, then not mentioned, then contradicted.";

// Rotate option orders by a fixed amount so the right answer is not always first.
const rotate = <T,>(xs: T[], k: number) => xs.map((_, i) => xs[(i + k) % xs.length]);

export const CAPP_VERBAL_STIMULI: Record<string, Stimulus> = Object.fromEntries(PASSAGES.map((p) => [p.id, { type: "text", title: p.title, body: p.body } satisfies Stimulus]));

export const CAPP_VERBAL: Item[] = PASSAGES.flatMap((p, n): Item[] => {
  const gapOpts = rotate(p.gap.options, (n + 1) % 4);
  const sumOpts = rotate(p.summary.options, (n + 2) % 4);
  const shown = rotate([...p.support], 1 + (n % 3)); // never 0, so the options are never already in order
  return [
    { id: `${p.id}-gap`, kind: "mcq", stimulus: p.id, prompt: p.gap.prompt, options: gapOpts, answer: gapOpts.indexOf(p.gap.options[p.gap.answer]), explanation: p.gap.why, difficulty: 2 },
    { id: `${p.id}-match`, kind: "mcq", stimulus: p.id, prompt: p.summary.prompt, options: sumOpts, answer: sumOpts.indexOf(p.summary.options[p.summary.answer]), explanation: p.summary.why, difficulty: 3 },
    {
      id: `${p.id}-rank`,
      kind: "rank",
      stimulus: p.id,
      prompt: "Put these statements in order of how well the passage supports them.",
      options: shown,
      order: p.support.map((t) => shown.indexOf(t)),
      orderLabel: "most supported first",
      explanation: `${SUPPORT_WHY} Correct order: ${p.support.map((t, i) => `${i + 1}. ${t}`).join(" ")}`,
      difficulty: 4,
    },
    { id: `${p.id}-tf`, kind: "tf-cannot-say", stimulus: p.id, prompt: p.tf.text, answer: p.tf.answer, explanation: p.tf.why, difficulty: 2 },
  ];
});

// Critical reasoning: five styles, four items each.

const FOLLOWS = ["Follows beyond reasonable doubt", "Does not follow beyond reasonable doubt"];
const ARGUMENT = ["Strong argument", "Weak argument"];
const ASSUMPTION = ["Assumption made", "Assumption not made"];

type Cr = { id: string; prompt: string; options: string[]; answer: number; why: string; stimulus?: string };

const CR_ITEMS: Cr[] = [
  // Logical conclusions: which conclusion must be true?
  { id: "lc1", prompt: "All analysts on the desk passed the exam. Priya is an analyst on the desk. Which conclusion must be true?", options: ["Priya is the best analyst on the desk.", "Priya passed the exam.", "Everyone who passed the exam is on the desk.", "Priya has worked on the desk the longest."], answer: 1, why: "If all analysts on the desk passed and Priya is one of them, Priya passed. The others go beyond the facts." },
  { id: "lc2", prompt: "No trades are settled on public holidays. Monday is a public holiday. Which conclusion must be true?", options: ["All trades settle on Tuesday.", "Some trades are settled on Monday.", "No trades are settled on Monday.", "Trades are only settled on Mondays."], answer: 2, why: "Monday is a public holiday and no trades settle on public holidays, so none settle on Monday. When they settle instead is not stated." },
  { id: "lc3", prompt: "Every client with a premium account has a named adviser. Some clients with named advisers live abroad. Which conclusion must be true?", options: ["Some premium clients live abroad.", "All clients who live abroad have premium accounts.", "Every client with a named adviser has a premium account.", "A client without a named adviser does not have a premium account."], answer: 3, why: "If every premium client has a named adviser, anyone without one cannot be premium. The clients abroad with advisers might not be premium, so the others don't have to be true." },
  { id: "lc4", prompt: "If the overnight system update fails, payments are delayed the next morning. Payments were not delayed this morning. Which conclusion must be true?", options: ["The overnight update did not fail.", "The update will fail tonight.", "Payments are never delayed.", "The update was cancelled."], answer: 0, why: "A failed update always delays payments; there was no delay, so the update did not fail. Whether it was cancelled or succeeded can't be told." },
  // Beyond reasonable doubt.
  { id: "brd1", prompt: "Passage: The branch's records show it opened 40 new accounts in May and 25 in June. Conclusion: The branch opened more new accounts in May than in June.", options: FOLLOWS, answer: 0, why: "The records give the two figures directly, so the conclusion follows." },
  { id: "brd2", prompt: "Passage: A survey of 50 customers at one branch found that 30 preferred using the app. Conclusion: Most of the bank's customers across the country prefer using the app.", options: FOLLOWS, answer: 1, why: "One branch's 50 customers may not represent customers nationally, so the conclusion is not beyond reasonable doubt." },
  { id: "brd3", prompt: "Passage: The fund's annual report states that it charged a fee of 0.5% in every year from 2021 to 2025. Conclusion: The fund charged 0.5% in 2023.", options: FOLLOWS, answer: 0, why: "2023 falls within 2021 to 2025, so the report covers it." },
  { id: "brd4", prompt: "Passage: Sales rose in the month after an advertising campaign began. Conclusion: The campaign caused the rise in sales.", options: FOLLOWS, answer: 1, why: "Something happening afterwards doesn't prove it was caused by the campaign; other factors could explain the rise." },
  // Arguments: strong (important and directly relevant) or weak.
  { id: "arg1", prompt: "Should banks check the identity of new customers? Yes, because checks help stop criminals using accounts to launder money.", options: ARGUMENT, answer: 0, why: "It is directly relevant and addresses a serious, important consequence." },
  { id: "arg2", prompt: "Should the company move its office to the city centre? Yes, because the city centre has more coffee shops.", options: ARGUMENT, answer: 1, why: "Coffee shops are a minor consideration compared with cost, staff and clients, so the argument is weak." },
  { id: "arg3", prompt: "Should apprentices be given mentors? No, because one mentor once forgot a meeting.", options: ARGUMENT, answer: 1, why: "A single lapse is not a good reason to drop mentoring for everyone." },
  { id: "arg4", prompt: "Should the bank test software updates before releasing them? Yes, because untested updates can stop customers making payments.", options: ARGUMENT, answer: 0, why: "It is directly relevant and points to a serious consequence for customers." },
  // True, false or cannot say on a passage.
  { id: "tf1", stimulus: "capp-cr-claims", prompt: "Northgate received 1,000 claims in February.", options: [], answer: 0, why: "1,200 is 20 per cent more than February, so February had 1,200 ÷ 1.2 = 1,000." },
  { id: "tf2", stimulus: "capp-cr-claims", prompt: "Fewer than half of March's claims were for storm damage.", options: [], answer: 1, why: "Most March claims were for storm damage." },
  { id: "tf3", stimulus: "capp-cr-claims", prompt: "All simple claims in March were settled within ten working days.", options: [], answer: 2, why: "Ten working days is only the company's aim; the passage doesn't say whether it was met." },
  { id: "tf4", stimulus: "capp-cr-claims", prompt: "There was a week of high winds before many of March's claims were made.", options: [], answer: 0, why: "Most March claims were for storm damage after a week of high winds." },
  // Assumptions.
  { id: "as1", prompt: "Statement: We should advertise the apprenticeship on social media to reach more school leavers. Assumption: School leavers use social media.", options: ASSUMPTION, answer: 0, why: "The plan only makes sense if school leavers use social media, so this is assumed." },
  { id: "as2", prompt: "Statement: We should advertise the apprenticeship on social media to reach more school leavers. Assumption: Social media is the only way to reach school leavers.", options: ASSUMPTION, answer: 1, why: "The statement says social media will reach more, not that nothing else works." },
  { id: "as3", prompt: "Statement: The bank is hiring more fraud analysts because fraud cases are rising. Assumption: More analysts can help the bank deal with more fraud cases.", options: ASSUMPTION, answer: 0, why: "Hiring analysts in response to more cases assumes extra analysts help." },
  { id: "as4", prompt: "Statement: The bank is hiring more fraud analysts because fraud cases are rising. Assumption: Fraud cases will keep rising for ever.", options: ASSUMPTION, answer: 1, why: "The decision responds to the current rise; it doesn't assume the rise will never stop." },
];

export const CAPP_CRITICAL_STIMULI: Record<string, Stimulus> = {
  "capp-cr-claims": {
    type: "text",
    title: "Northgate Insurance",
    body: "Northgate Insurance received 1,200 claims in March, 20 per cent more than in February. Most claims in March were for storm damage after a week of high winds. The company aims to settle simple claims within ten working days.",
  },
};

export const CAPP_CRITICAL: Item[] = CR_ITEMS.map((c): Item =>
  c.stimulus
    ? { id: `capp-cr-${c.id}`, kind: "tf-cannot-say", stimulus: c.stimulus, prompt: c.prompt, answer: c.answer as 0 | 1 | 2, explanation: c.why, difficulty: 3 }
    : { id: `capp-cr-${c.id}`, kind: "mcq", prompt: c.prompt, options: c.options, answer: c.answer, explanation: c.why, difficulty: 3 },
);
