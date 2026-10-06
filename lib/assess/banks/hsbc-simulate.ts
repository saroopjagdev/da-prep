// Replica of the structure candidates report for HSBC's Simulate assessment (built by Cappfinity): five tiles done in
// order, 38 questions in all, about 16 cognitive (data interpretation, verbal, inductive) and 22 situational judgement
// or work-style. Tile names, question counts and response styles follow prep-site reports (see tests.ts). Every
// scenario, number and statement below is original: the company, people and figures are invented, and nothing is
// copied from HSBC or any prep site. How the cognitive and judgement questions split across tiles 3 and 4 is not
// published, so that split is our estimate.

import { INDUCTIVE } from "@/lib/assess/banks/inductive";
import { TRAIT_BANK } from "@/lib/assess/banks/traits";
import type { Item, Stimulus } from "@/lib/assess/types";

type Tile = { items: Item[]; stimuli: Record<string, Stimulus> };

/** Rate every action: 0 counterproductive, 1 ineffective, 2 fairly effective, 3 effective. */
const rate = (id: string, stimulus: string | undefined, prompt: string, actions: [string, number][], why: string): Item => ({
  id,
  kind: "rate-each",
  stimulus,
  prompt,
  actions: actions.map((a) => a[0]),
  ratings: actions.map((a) => a[1]),
  explanation: why,
  difficulty: 3,
});

const mostLeast = (id: string, stimulus: string | undefined, prompt: string, options: string[], most: number, least: number, why: string): Item => ({
  id,
  kind: "most-least",
  stimulus,
  prompt,
  options,
  most,
  least,
  explanation: why,
  difficulty: 3,
});

const rank = (id: string, stimulus: string | undefined, prompt: string, options: string[], order: number[], why: string): Item => ({
  id,
  kind: "rank",
  stimulus,
  prompt,
  options,
  order,
  explanation: why,
  difficulty: 3,
});

const mcq = (id: string, stimulus: string, prompt: string, options: string[], answer: number, why: string, difficulty: 1 | 2 | 3 | 4 | 5 = 3): Item => ({
  id,
  kind: "mcq",
  stimulus,
  prompt,
  options,
  answer,
  explanation: why,
  difficulty,
});

const numeric = (id: string, stimulus: string, prompt: string, answer: number, unit: string, why: string, tolerance = 0): Item => ({
  id,
  kind: "numeric",
  stimulus,
  prompt,
  answer,
  unit,
  tolerance,
  explanation: why,
  difficulty: 3,
});

const tf = (id: string, stimulus: string, prompt: string, answer: 0 | 1 | 2, why: string): Item => ({
  id,
  kind: "tf-cannot-say",
  stimulus,
  prompt,
  answer,
  explanation: why,
  difficulty: 3,
});

// ---------------------------------------------------------------------------------------------------------------
// Tile 1: Project Kick-Off (4 situational judgement questions)

const TILE_1: Tile = {
  stimuli: {
    brief: {
      type: "text",
      title: "Project Lantern: kick-off",
      body:
        "You are an apprentice in the Operations team at Meridian, an international business. Today is the first meeting of Project Lantern, a six-person team from Operations, Technology and Risk. The project will move customer records onto a new system over the next four months.\n\nPriya, the project lead, runs the meeting. Each person will own part of the plan.",
    },
  },
  items: [
    rate(
      "hs-1-1",
      "brief",
      "Priya asks each person to say what they need from the others. You are not sure exactly what your part of the project covers. Rate how effective each action would be.",
      [
        ["Ask Priya in the meeting to confirm what you are responsible for and by when", 3],
        ["Say nothing now and work out what you need later", 1],
        ["Ask a teammate afterwards what they think your part is", 2],
        ["Assume it is similar to a task you did on another project and begin on that", 0],
      ],
      "Checking your responsibilities openly, early and with the person who decides them, avoids duplicated or missed work. Guessing or relying on a second-hand view risks the wrong work being done.",
    ),
    mostLeast(
      "hs-1-2",
      "brief",
      "Dev from Technology says testing needs six weeks. Marcus from Risk says the plan allows two weeks and the deadline cannot move. They both look to you, because you wrote the first draft of the plan. Choose the MOST effective and the LEAST effective response.",
      [
        "Say that you will sit with both of them after the meeting to see what testing is essential and what the plan can allow, then report back to Priya",
        "Tell them to agree it between themselves before the next meeting",
        "Say the plan is only a draft and the time can be whatever Dev needs",
        "Agree with Marcus because the deadline is fixed",
      ],
      0,
      2,
      "Taking ownership of the problem, bringing the two views together and keeping the lead informed is most effective. Changing the plan on your own, without checking with the people affected, is least effective.",
    ),
    rate(
      "hs-1-3",
      "brief",
      "While preparing for the next meeting you notice that the project plan has no time set aside for training the staff who will use the new system. Rate how effective each action would be.",
      [
        ["Raise it with Priya before the next meeting, with a suggestion for when training could fit", 3],
        ["Add a training week to the plan yourself without telling anyone", 1],
        ["Wait and see whether someone else notices", 0],
        ["Mention it to a teammate and leave it with them to follow up", 2],
      ],
      "Raising a gap with the person who owns the plan, and offering a suggestion, helps the project. Silently changing a shared plan or waiting for others to notice both create risk.",
    ),
    rank(
      "hs-1-4",
      "brief",
      "After the meeting you have four things to do before the end of the week. Put them in the order you would do them, most effective first.",
      [
        "Send the notes and actions to everyone who attended, so owners and dates are clear",
        "Tidy your own folder of project documents",
        "Book thirty minutes with Dev to understand what the new system needs from Operations",
        "Draft a first list of risks to the timetable and check it with Priya",
      ],
      [0, 2, 3, 1],
      "Sharing clear actions while the meeting is fresh comes first. Then learn what the system needs, and list the risks to the timetable. Personal tidying is useful but least urgent.",
    ),
  ],
};

// ---------------------------------------------------------------------------------------------------------------
// Tile 2: Global Engagement (4 situational judgement questions: communication and conflict)

const TILE_2: Tile = {
  stimuli: {
    brief: {
      type: "text",
      title: "Working with colleagues in other countries",
      body:
        "Project Lantern includes colleagues in Singapore and Toronto as well as London. Most communication is by email and video call. When it is 9am in London it is 4pm in Singapore and 4am in Toronto.\n\nIn the last week the Singapore team has missed two deadlines for data you need.",
    },
  },
  items: [
    rate(
      "hs-2-1",
      "brief",
      "The Singapore team's data is late again and your own deadline is in two days. Rate how effective each action would be.",
      [
        ["Phone or message your Singapore contact to ask what is causing the delay and whether anything can help", 3],
        ["Send a group email to the whole project copying in Priya, saying Singapore keeps missing deadlines", 0],
        ["Wait for the data and tell Priya on the day if you miss your own deadline", 1],
        ["Tell Priya about the risk to your deadline and ask whether she wants you to contact Singapore", 2],
      ],
      "Asking directly and with curiosity usually solves delays fastest. Blaming a team in public damages trust, and staying silent leaves your own deadline at risk.",
    ),
    mostLeast(
      "hs-2-2",
      "brief",
      "You send an email with instructions to the Toronto team. Their reply suggests they have understood the opposite of what you meant. Choose the MOST effective and the LEAST effective response.",
      [
        "Reply politely, restating the instruction in simple steps and offering a short call to check it is clear",
        "Ignore the reply and wait to see what they do",
        "Reply saying they have misread your email",
        "Forward the exchange to Priya and ask her to explain it to them",
      ],
      0,
      2,
      "Taking responsibility for being clear and offering a call resolves it quickly. Telling people they have misread the message makes the problem about blame.",
    ),
    rate(
      "hs-2-3",
      "brief",
      "A weekly video call is held at 4pm London time, which is midnight in Toronto. A Toronto colleague has mentioned that this is hard for them. Rate how effective each action would be.",
      [
        ["Suggest to Priya that the call time rotates so that no one location always has the late or early slot", 3],
        ["Tell your Toronto colleague that the time was agreed and they will need to cope", 0],
        ["Offer to send the Toronto colleague a short summary after each call", 2],
        ["Say nothing because it is not your decision", 1],
      ],
      "Fairness across locations, raised with the person who decides, is the most effective option. A summary helps but does not remove the problem.",
    ),
    mostLeast(
      "hs-2-4",
      "brief",
      "A colleague in Singapore disagrees strongly with your suggestion in a video call and sounds annoyed. Choose the MOST effective and the LEAST effective response.",
      [
        "Thank them for being direct, ask them to explain their concern and look for what you both agree on",
        "Say that you will follow Priya's decision whatever the rest of the team thinks",
        "Defend your suggestion until they accept it",
        "Change the subject and bring it up with them privately later",
      ],
      0,
      2,
      "Listening and finding common ground builds a good working relationship. Defending your view until the other person gives in turns a difference of opinion into a contest.",
    ),
  ],
};

// ---------------------------------------------------------------------------------------------------------------
// Tile 3: Data Monitoring (10 questions: 8 data interpretation / verbal, 2 situational judgement)

const ALERTS = [
  ["Europe", 840, 780, 42],
  ["Asia", 620, 600, 31],
  ["Americas", 710, 640, 57],
  ["Middle East", 230, 210, 9],
] as const;
const totalRaised = ALERTS.reduce((s, r) => s + r[1], 0);
const americas = ALERTS[2];
const pct = (n: number, d: number) => (100 * n) / d;
const escalationRates = ALERTS.map((r) => pct(r[3], r[2]));
const topRate = escalationRates.indexOf(Math.max(...escalationRates));
const DAILY = [210, 260, 245, 300, 275];
const daily = { mon: DAILY[0], thu: DAILY[3] };
const rise = Math.round(pct(daily.thu - daily.mon, daily.mon));
const avgDaily = DAILY.reduce((a, b) => a + b, 0) / DAILY.length;

const TILE_3: Tile = {
  stimuli: {
    table: {
      type: "table",
      title: "Payment alerts by region, last month",
      columns: ["Region", "Alerts raised", "Alerts reviewed", "Escalated to a team leader"],
      rows: ALERTS.map((r) => [r[0], r[1], r[2], r[3]]),
      note: "Escalated alerts are a subset of the alerts reviewed.",
    },
    chart: {
      type: "chart",
      title: "Alerts reviewed per day, last week",
      kind: "bar",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      series: [{ name: "Alerts reviewed", values: DAILY }],
    },
    guidance: {
      type: "text",
      title: "Monitoring guidance",
      body:
        "The system rates every alert low, medium or high. High-rated alerts must be reviewed by a trained analyst within four hours. Medium-rated alerts must be reviewed within one working day. Low-rated alerts are reviewed in a weekly batch.\n\nAn analyst who is unsure about any alert may escalate it to a team leader, but must record a reason. An escalated alert does not count as reviewed until a team leader has signed it off.",
    },
    spike: {
      type: "text",
      title: "Tuesday morning",
      body:
        "While reviewing alerts you notice that one small business customer has triggered a very large number of medium-rated alerts since 7am, far more than any other customer. Your team leader is in meetings until noon.",
    },
  },
  items: [
    mcq(
      "hs-3-1",
      "table",
      "What percentage of the alerts raised in the Americas were reviewed? Choose the nearest.",
      ["84%", "87%", "90%", "93%"],
      2,
      `${americas[2]} reviewed out of ${americas[1]} raised is ${pct(americas[2], americas[1]).toFixed(1)}%, so about 90%.`,
    ),
    mcq(
      "hs-3-2",
      "table",
      "Of the alerts reviewed, which region escalated the highest proportion to a team leader?",
      ["Europe", "Asia", "Americas", "Middle East"],
      topRate,
      `Escalated divided by reviewed: ${ALERTS.map((r, i) => `${r[0]} ${escalationRates[i].toFixed(1)}%`).join(", ")}. The Americas is highest.`,
    ),
    numeric("hs-3-3", "table", "How many alerts were raised in total across the four regions?", totalRaised, "alerts", `${ALERTS.map((r) => r[1]).join(" + ")} = ${totalRaised}.`),
    mcq(
      "hs-3-4",
      "chart",
      "By roughly what percentage did the number of alerts reviewed rise between Monday and Thursday?",
      ["30%", "36%", "43%", "90%"],
      2,
      `From ${daily.mon} to ${daily.thu} is a rise of ${daily.thu - daily.mon}. ${daily.thu - daily.mon} divided by ${daily.mon} is about ${rise}%.`,
    ),
    numeric("hs-3-5", "chart", "What was the average number of alerts reviewed per day last week?", avgDaily, "alerts", `${DAILY.join(" + ")} = ${DAILY.reduce((a, b) => a + b, 0)}, divided by 5 = ${avgDaily}.`),
    tf("hs-3-6", "guidance", "A medium-rated alert can wait until the next working day to be reviewed.", 0, "Medium-rated alerts must be reviewed within one working day."),
    tf("hs-3-7", "guidance", "An analyst needs to record a reason to escalate a low-rated alert.", 0, "Any alert can be escalated, and a reason must be recorded."),
    tf("hs-3-8", "guidance", "Team leaders usually sign off escalated alerts within an hour.", 2, "The guidance does not say how long sign-off takes, so you cannot say."),
    rate(
      "hs-3-9",
      "spike",
      "Rate how effective each action would be.",
      [
        ["Review the alerts on that customer's account now and record what you see, then raise it with your team leader when they are free", 3],
        ["Leave the alerts until your team leader is back at noon", 1],
        ["Close the alerts as reviewed because they are only medium-rated", 0],
        ["Escalate the account with a short written reason so it is visible straight away", 2],
      ],
      "Medium-rated alerts have a one-day limit, so reviewing now is reasonable, and recording what you see helps your team leader. Closing them without a proper look is the worst option.",
    ),
    mostLeast(
      "hs-3-10",
      "guidance",
      "A colleague has escalated several alerts without recording a reason because they were short of time. Choose the MOST effective and the LEAST effective response.",
      [
        "Remind them that a reason is required and offer to help them add the missing reasons",
        "Add the reasons yourself without telling them",
        "Say nothing because it is their responsibility",
        "Tell the team leader that your colleague ignores the rules",
      ],
      0,
      2,
      "A prompt, helpful reminder fixes the gap and helps your colleague learn. Saying nothing leaves the missing reasons, and the habit, unaddressed.",
    ),
  ],
};

// ---------------------------------------------------------------------------------------------------------------
// Tile 4: Navigating Competing Commitments (9 questions: 8 cognitive, 1 situational judgement)

const TASKS = [
  ["Check the data file", 40, "10:30"],
  ["Reply to client queries", 45, "11:00"],
  ["Prepare the weekly report", 90, "12:00"],
  ["Update the tracker", 30, "17:00"],
] as const;
const totalMinutes = TASKS.reduce((s, t) => s + t[1], 0);
// Doing the tasks in deadline order from 09:00 without a break.
let clock = 9 * 60;
const finish: number[] = [];
for (const t of TASKS) {
  clock += t[1];
  finish.push(clock);
}
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const deadlineMin = (d: string) => Number(d.slice(0, 2)) * 60 + Number(d.slice(3));
// Report first, then the others in deadline order.
const reportFirst = [TASKS[2], TASKS[0], TASKS[1], TASKS[3]];
clock = 9 * 60;
let late = 0;
for (const t of reportFirst) {
  clock += t[1];
  if (clock > deadlineMin(t[2])) late++;
}

const TILE_4: Tile = {
  stimuli: {
    tasks: {
      type: "table",
      title: "Your tasks today",
      columns: ["Task", "Time needed (minutes)", "Deadline"],
      rows: TASKS.map((t) => [t[0], t[1], t[2]]),
      note: "You start at 09:00. Team training runs 14:00 to 15:00 and cannot move. Ignore breaks.",
    },
    diary: {
      type: "text",
      title: "Your manager's note",
      body:
        "Sam, your manager, has written: Your priority this week is the weekly report. Client queries come second, because customers are waiting. Data checks and the tracker can slip by a day if needed, as long as you tell me. I am out of the office until 1pm, so contact Lena if anything urgent comes up.",
    },
  },
  items: [
    numeric("hs-4-1", "tasks", "How many minutes of work do the four tasks need in total?", totalMinutes, "minutes", `${TASKS.map((t) => t[1]).join(" + ")} = ${totalMinutes}.`),
    mcq(
      "hs-4-2",
      "tasks",
      "If you do the tasks in order of deadline, starting at 09:00 with no break, when will you finish the weekly report?",
      ["11:15", "11:55", "12:25", "12:40"],
      1,
      `In deadline order (${TASKS.map((t) => t[0].toLowerCase()).join(", ")}), the report finishes at ${hhmm(finish[2])}, in time for its 12:00 deadline.`,
    ),
    numeric(
      "hs-4-3",
      "tasks",
      "Suppose you do the weekly report first, then the other tasks in deadline order, starting at 09:00. How many tasks would finish after their deadline?",
      late,
      "tasks",
      `Report 09:00 to 10:30 is on time, the data check ends 11:10 (deadline 10:30, late), the client queries end 11:55 (deadline 11:00, late), the tracker ends 12:25 (deadline 17:00, on time). That is ${late} late.`,
    ),
    mcq(
      "hs-4-4",
      "tasks",
      "After finishing all four tasks in deadline order from 09:00, how many minutes of working time are left before team training starts at 14:00? Ignore breaks.",
      ["95 minutes", "155 minutes", "175 minutes", "335 minutes"],
      0,
      `Tasks finish at ${hhmm(finish[3])}. From ${hhmm(finish[3])} to 14:00 is ${14 * 60 - finish[3]} minutes.`,
    ),
    tf("hs-4-5", "diary", "Sam is happy for the tracker to be updated a day late without being told.", 1, "Sam says tasks can slip as long as you tell them, so the statement is false."),
    tf("hs-4-6", "diary", "Lena can deal with urgent issues while Sam is away.", 2, "Sam only says to contact Lena if something urgent comes up. Whether Lena can deal with it is not stated, so you cannot say."),
    // Two inductive (sequence) items from the existing bank.
    ...["ind-arith-1", "ind-geo-1"].map((id) => {
      const it = INDUCTIVE.find((x) => x.id === id);
      if (!it || it.kind !== "mcq") throw new Error(`missing inductive item ${id}`);
      return { ...it, id: `hs-4-${id === "ind-arith-1" ? 7 : 8}` } as Item;
    }),
    rank(
      "hs-4-9",
      "diary",
      "At 10:00 Lena emails asking you to drop what you are doing and help her with an urgent client request that will take about an hour. Put these actions in the order you would do them, most effective first.",
      [
        "Check how urgent Lena's request is and how it compares with the weekly report",
        "Tell Sam by message what has come up and what you plan to do, so they know",
        "Start helping Lena straight away without telling anyone",
        "Tell Lena you will help once the weekly report is done",
      ],
      [0, 1, 3, 2],
      "Find out how urgent it is, tell your manager, and agree a sensible plan. Dropping the priority task without telling anyone is least effective.",
    ),
  ],
};

// ---------------------------------------------------------------------------------------------------------------
// Tile 5: Pause and Reflect (11 questions: 3 situational judgement, 8 work-style statements)

const LIKERT_PICKS = [0, 3, 6, 9, 12, 15, 17, 19]; // spread across the traits in the shared work-style bank
const TILE_5: Tile = {
  stimuli: {
    reflect: {
      type: "text",
      title: "Looking back on the project",
      body:
        "Project Lantern has now been running for three months. Your part of the work is mostly done. Before the final review meeting you have a few minutes to think about how you have worked and what you have learned.",
    },
  },
  items: [
    rate(
      "hs-5-1",
      "reflect",
      "You realise that a figure you sent in a report last month was wrong, and nobody has noticed. The error would change a decision in the final review. Rate how effective each action would be.",
      [
        ["Tell Priya straight away, explain what happened and bring a corrected figure", 3],
        ["Correct the figure in the shared file quietly and say nothing", 1],
        ["Wait for the final review and hope the figure is not used", 0],
        ["Tell your teammate and ask them what they think you should do", 2],
      ],
      "Owning an error quickly, with a fix, protects the decision and your credibility. Hiding it, even with a quiet fix, leaves others unaware.",
    ),
    mostLeast(
      "hs-5-2",
      "reflect",
      "Priya asks what you would do differently if you did the project again. Choose the MOST effective and the LEAST effective response.",
      [
        "Give one or two specific examples of what you would change and what you learned from them",
        "Say that you cannot think of anything because it went well",
        "Say that most problems were caused by delays from other teams",
        "Give a long list of everything that was wrong with the project plan",
      ],
      0,
      1,
      "Specific reflection that shows what you have learned is most effective. Claiming nothing could be improved shows little self-awareness.",
    ),
    rate(
      "hs-5-3",
      "reflect",
      "A new apprentice joining the next project asks you for advice on getting started. Rate how effective each action would be.",
      [
        ["Share two or three practical things you learned and offer to answer questions as they come up", 3],
        ["Tell them it is best to work things out for themselves", 1],
        ["Send them your full set of notes with no explanation", 2],
        ["Say you are too busy to help", 0],
      ],
      "Giving practical advice and staying available helps a new colleague. Handing over notes alone is useful but less personal.",
    ),
    ...LIKERT_PICKS.map((n, i): Item => {
      const it = TRAIT_BANK.likert[n];
      if (!it) throw new Error(`missing work-style item ${n}`);
      return { ...it, id: `hs-5-${4 + i}` };
    }),
  ],
};

export const HSBC_SIMULATE: { id: string; title: string; instructions: string; tile: Tile; calculator: boolean }[] = [
  {
    id: "hs-t1",
    title: "Tile 1: Project Kick-Off",
    instructions: "Four situational judgement questions about the first meeting of a project. Rate, choose and rank the actions you would take. There are no calculators here.",
    tile: TILE_1,
    calculator: false,
  },
  {
    id: "hs-t2",
    title: "Tile 2: Global Engagement",
    instructions: "Four questions about communication and disagreement when your team works across countries and time zones.",
    tile: TILE_2,
    calculator: false,
  },
  {
    id: "hs-t3",
    title: "Tile 3: Data Monitoring",
    instructions: "Ten questions that mix reading tables and charts, checking statements against a short guidance note, and deciding what to do. A calculator is provided.",
    tile: TILE_3,
    calculator: true,
  },
  {
    id: "hs-t4",
    title: "Tile 4: Navigating Competing Commitments",
    instructions: "Nine questions about planning a working day: timings, a manager's note, a pattern question and a priority decision. A calculator is provided.",
    tile: TILE_4,
    calculator: true,
  },
  {
    id: "hs-t5",
    title: "Tile 5: Pause and Reflect",
    instructions: "Three reflective judgement questions, then eight statements about how you work. For the statements there are no right or wrong answers: choose how much you agree.",
    tile: TILE_5,
    calculator: false,
  },
];

export const HSBC_SIMULATE_QUESTIONS = HSBC_SIMULATE.reduce((n, t) => n + t.tile.items.length, 0);
