// Original situational judgement items set in an apprentice's working life. Hand-written. Scenarios reward the
// behaviours employers publish (take ownership, tell people early, ask for help, act safely, treat people with respect)
// and penalise hiding problems, blame and doing nothing. Option order is shuffled deterministically at build time.
// The pools are bigger than one attempt: each test serves a fresh selection (see `sample` in lib/assess/tests.ts).

import { rng } from "@/lib/assess/rng";
import type { Item } from "@/lib/assess/types";

type ML = { scenario: string; best: string; others: string[]; worst: string; why: string };

const MOST_LEAST: ML[] = [
  {
    scenario: "Your manager asked you to finish a report by Friday. On Wednesday you realise you misunderstood part of the brief and cannot finish in time.",
    best: "Tell your manager today what happened and suggest a revised plan.",
    others: ["Work late each night and hope to finish without telling anyone.", "Hand in what you have on Friday without comment."],
    worst: "Ask a colleague to finish it and say nothing to your manager.",
    why: "Telling your manager early gives them time to adjust and shows ownership. Passing the work on secretly hides the problem and the extra effort.",
  },
  {
    scenario: "You notice a colleague often takes long breaks, leaving the team short at busy times.",
    best: "Mention your concern to your colleague privately and ask if anything is wrong.",
    others: ["Tell your manager straight away, without speaking to your colleague first.", "Say nothing and cover for them when you can."],
    worst: "Tell the rest of the team what you have noticed.",
    why: "A private, respectful conversation comes first. Discussing it with the wider team is gossip and damages trust.",
  },
  {
    scenario: "Work has been busy and you are falling behind on a college assignment due in two weeks.",
    best: "Speak to your manager and your tutor now to agree what support or time you can have.",
    others: ["Work through weekends and say nothing.", "Ask a friend on the course for their answers."],
    worst: "Leave it and hope the deadline gets extended.",
    why: "Early conversations let both your employer and your tutor help. Copying is dishonest and waiting passively solves nothing.",
  },
  {
    scenario: "A customer rings, angry about a late delivery that was not your fault.",
    best: "Listen, apologise for the experience, and explain what you will do next to put it right.",
    others: ["Explain that delivery is a different department and transfer the call.", "Explain calmly why the delay was not your team's fault."],
    worst: "End the call when they raise their voice.",
    why: "Acknowledging the problem and taking ownership of next steps keeps the customer's trust. Ending the call is the worst outcome.",
  },
  {
    scenario: "In a group project the team leader chooses your idea, but you think a teammate's idea is better.",
    best: "Suggest comparing both ideas against the project goals with the whole team.",
    others: ["Say nothing and go along with your own idea.", "Tell your teammate to challenge the leader."],
    worst: "Quietly start working on your teammate's idea instead.",
    why: "Raising it openly keeps the team aligned on the best result. Working against the agreed plan in secret causes confusion.",
  },
  {
    scenario: "In the workshop you see a cable trailing across a walkway.",
    best: "Make it safe if you can do so without risk, and report it.",
    others: ["Warn people nearby and move on.", "Mention it to a colleague so they can deal with it later."],
    worst: "Leave it, assuming someone else will notice.",
    why: "Safety hazards need action and a report. Assuming someone else will deal with it is how accidents happen.",
  },
  {
    scenario: "Your manager criticises your presentation in front of the team.",
    best: "Listen, then ask afterwards for specific examples so you can improve.",
    others: ["Explain immediately why you made those choices.", "Agree in the meeting and avoid presenting again."],
    worst: "Complain about your manager to colleagues afterwards.",
    why: "Treating feedback as information helps you improve. Complaining behind their back damages relationships without fixing anything.",
  },
  {
    scenario: "You accidentally email a spreadsheet containing client details to the wrong external address.",
    best: "Tell your manager or the data protection lead immediately so they can act.",
    others: ["Email the recipient asking them to delete it, and report it afterwards.", "Email the recipient asking them to delete it, and report it at the end of the week."],
    worst: "Wait to see whether anything comes of it.",
    why: "Data incidents must be reported straight away so they can be contained. Delaying the report, or waiting to see what happens, increases the harm.",
  },
  {
    scenario: "Two managers each give you an urgent task with the same deadline.",
    best: "Explain the clash to both and ask them to agree which comes first.",
    others: ["Do the task from the manager you know better.", "Do the shorter task first and then see."],
    worst: "Try to do both at once and hand in rushed work.",
    why: "Both managers need to know, and only they can decide priority. Rushing both usually means neither is done well.",
  },
  {
    scenario: "You have finished your tasks early and there are two hours left in the day.",
    best: "Ask your team whether anyone needs help, or pick up a learning task.",
    others: ["Tidy your desk and wait to be told what to do.", "Start on tomorrow's work without asking."],
    worst: "Leave early without telling anyone.",
    why: "Offering help or using the time to learn shows initiative. Leaving without telling anyone is unreliable.",
  },
  // Finance workplace scenarios (banking, operations and client service).
  {
    scenario: "At 4.45pm you spot that a trade was booked with the wrong quantity. It settles tomorrow and the trader who booked it has left for the day.",
    best: "Flag it to your supervisor or the desk lead now so it can be corrected before the cut-off.",
    others: ["Email the trader so they see it first thing tomorrow.", "Make a note and mention it at tomorrow's morning meeting."],
    worst: "Change the booking yourself without telling anyone.",
    why: "Errors that affect settlement need someone with authority to act today. Changing a booking yourself, unrecorded, breaks the firm's controls even if your correction is right.",
  },
  {
    scenario: "At a party, a friend asks what deals your team is working on.",
    best: "Say politely that you can't discuss your work and change the subject.",
    others: ["Tell them the client's industry but not its name.", "Say you're not really sure and move on."],
    worst: "Share a few details, since your friend doesn't work in finance.",
    why: "Client and deal information is confidential whoever is asking. Even partial details can identify a client.",
  },
  {
    scenario: "After you helped a client with a problem, they offer you expensive concert tickets.",
    best: "Check the firm's gifts policy with your manager before responding.",
    others: ["Decline politely without mentioning it to anyone.", "Accept, and tell your manager afterwards."],
    worst: "Accept and keep it to yourself.",
    why: "Banks have gifts and entertainment rules to avoid conflicts of interest. Checking first is safest; hiding a gift is the worst choice.",
  },
  {
    scenario: "You are preparing figures for a client meeting in an hour and find the data has not updated since last week.",
    best: "Tell the person who asked straight away and agree whether to use the latest reliable data with a clear note.",
    others: ["Use last week's data and add a small footnote.", "Spend the hour trying to fix the data feed yourself."],
    worst: "Use last week's data and present it as current.",
    why: "The person relying on the figures needs to know now so they can decide. Presenting old data as current misleads the client.",
  },
  {
    scenario: "A senior colleague asks you to put an earlier date on a document 'to keep things tidy'.",
    best: "Politely decline, ask how they would like to handle it properly, and raise it with your manager or compliance if they insist.",
    others: ["Do it, but keep a private note that it was backdated.", "Ask another apprentice what they would do."],
    worst: "Backdate it as asked because they are senior.",
    why: "Backdating records can be misleading or even fraudulent. Seniority does not make it acceptable, and there are people you can escalate to.",
  },
  {
    scenario: "In the lift you overhear that a listed company is about to be bought. Your uncle owns shares in it.",
    best: "Keep it to yourself, don't trade or tip anyone off, and tell compliance what you overheard.",
    others: ["Keep it to yourself and say nothing to anyone.", "Ask the people in the lift to be more careful where they talk."],
    worst: "Hint to your uncle that he might want to hold on to his shares.",
    why: "Passing on or acting on inside information is a criminal offence. Telling compliance protects you and lets them manage the leak.",
  },
  {
    scenario: "A client rings, very upset that a payment is late. You don't have authority to approve compensation.",
    best: "Apologise, find out what has happened, involve someone who can decide, and tell the client when they will hear back.",
    others: ["Tell them it's not your area and give them a general number.", "Say you'll look into it, without giving a time."],
    worst: "Promise compensation to calm them down.",
    why: "Owning the next steps keeps the client's trust. Promising something you can't authorise creates a bigger problem later.",
  },
  {
    scenario: "You find a small error in a spreadsheet you sent to a client yesterday. Nobody has noticed.",
    best: "Tell your manager now and agree how to send the client a corrected version.",
    others: ["Send the client a corrected version without telling your manager.", "Fix your own copy in case anyone asks."],
    worst: "Leave it, because the difference is small.",
    why: "Clients rely on accurate figures, and your manager needs to know what went out. Ignoring an error, however small, damages trust if it is found later.",
  },
  {
    scenario: "Your team uses one shared login for a system to save time, although the policy says everyone needs their own.",
    best: "Raise it with your manager and ask for your own access.",
    others: ["Use the shared login like everyone else.", "Stop using the system and wait for someone to notice."],
    worst: "Give the shared login to a friend in another team who needs some data.",
    why: "Individual logins mean every action can be traced. Raising it fixes the risk; spreading the login makes it worse.",
  },
  {
    scenario: "On a call, a client asks which investment you would recommend. You are not qualified to give advice.",
    best: "Explain that you can't advise on that and arrange for a qualified colleague to call them.",
    others: ["Give your personal view but say it isn't advice.", "Suggest they search online."],
    worst: "Recommend a product you think will do well.",
    why: "Giving advice without being authorised breaks the rules that protect customers. Passing them to a qualified colleague helps the client properly.",
  },
  {
    scenario: "In a meeting, a senior banker uses a market figure you know is out of date. It is about to go into a client pitch.",
    best: "Politely point out that the figure has changed and offer the updated source.",
    others: ["Message the banker after the meeting with the updated figure.", "Mention it to another apprentice."],
    worst: "Say nothing: it isn't your place to correct a senior banker.",
    why: "Accuracy matters more than hierarchy, especially for client material. Raising it promptly and politely is what good teams want.",
  },
  {
    scenario: "You notice a colleague regularly emails work documents to their personal address so they can work at home.",
    best: "Remind them it is against policy and suggest the approved way to work remotely.",
    others: ["Report them to your manager without speaking to them first.", "Ignore it, since they are working hard."],
    worst: "Start doing the same so you can keep up.",
    why: "Sending client data to personal accounts is a data-protection risk. A friendly reminder is a good first step; copying the behaviour is the worst option.",
  },
  {
    scenario: "A recruiter from a rival bank asks you for your team's client list 'to understand the market'.",
    best: "Decline and don't share any client information.",
    others: ["Share only clients whose names are already public.", "Say you'll think about it."],
    worst: "Send the list, since it's only names.",
    why: "Client lists are confidential business information. Sharing them, even partly, breaches your duty to your employer and its clients.",
  },
  {
    scenario: "Your manager asks you to use a new data tool you have never used, for a task due tomorrow.",
    best: "Spend a short time with the guide, then ask a colleague who uses it to show you the basics.",
    others: ["Do the task in a spreadsheet instead without saying so.", "Tell your manager you can't do it."],
    worst: "Guess your way through and submit without checking.",
    why: "Trying first and then asking for targeted help is how apprentices learn quickly. Submitting unchecked work risks errors.",
  },
];

type RE = { scenario: string; actions: [text: string, rating: number][]; why: string };

const RATE_EACH: RE[] = [
  {
    scenario: "A new team member seems isolated at lunch and in meetings.",
    actions: [
      ["Invite them to join you for lunch and ask about their interests.", 3],
      ["Suggest to your manager that they might benefit from a buddy.", 2],
      ["Leave them alone: they will settle in when they are ready.", 1],
      ["Tell others in the team that they seem odd.", 0],
    ],
    why: "Including people directly is the strongest response. Raising it with your manager helps too. Doing nothing leaves them isolated, and gossip is harmful.",
  },
  {
    scenario: "You need to explain a delay to a client by email.",
    actions: [
      ["Explain honestly what happened, give the new date and say how you will prevent it recurring.", 3],
      ["Send a short note with the new date and no explanation.", 2],
      ["Wait for the client to chase before replying.", 1],
      ["Say another team caused the delay.", 0],
    ],
    why: "Honest, specific communication builds trust. Blaming another team and waiting to be chased both damage it.",
  },
  {
    scenario: "Your deadline is tomorrow. You realise one figure in your report may be wrong and checking it will take two hours.",
    actions: [
      ["Check the figure and tell your manager if it will affect the deadline.", 3],
      ["Submit on time and flag that the figure is unchecked.", 2],
      ["Submit on time and say nothing.", 1],
      ["Change the figure to what you think is right without telling anyone.", 0],
    ],
    why: "Accuracy matters and so does openness. Quietly changing data is the most damaging choice.",
  },
  {
    scenario: "You notice that your team's process creates extra work for another team.",
    actions: [
      ["Collect a few examples and suggest an improvement to your manager.", 3],
      ["Bring it up at the next team meeting.", 2],
      ["Carry on as usual: it is not your responsibility.", 1],
      ["Tell the other team they are being unreasonable.", 0],
    ],
    why: "Evidence and a suggested fix show you can see the bigger picture. Dismissing the other team's problem is unhelpful.",
  },
  {
    scenario: "You must choose between two suppliers. The cheaper one has poor customer reviews.",
    actions: [
      ["Compare cost and quality evidence and talk it through with your manager.", 3],
      ["Ask an experienced colleague for their view, then decide.", 2],
      ["Pick the cheaper one because it saves money.", 1],
      ["Choose at random.", 0],
    ],
    why: "Good decisions weigh the evidence and use advice. Asking an experienced colleague helps but skips your own check of the evidence. Choosing on price alone ignores the risk, and chance is not a decision.",
  },
  {
    scenario: "You receive negative feedback on a piece of written work.",
    actions: [
      ["Ask for examples and agree steps to improve.", 3],
      ["Make the corrections and move on.", 2],
      ["Say it is a matter of opinion.", 1],
      ["Stop submitting written work.", 0],
    ],
    why: "Asking for examples turns feedback into learning. Making the changes is good, arguing is unhelpful, and avoiding the work is the worst option.",
  },
  // Finance workplace scenarios.
  {
    scenario: "Two reports should match but differ by £1,200, and the deadline is in an hour.",
    actions: [
      ["Look for the cause, and tell your manager the status and what is left before the deadline.", 3],
      ["Tell your manager about the difference and ask how they want you to proceed.", 2],
      ["Submit on time and mention the difference only if asked.", 1],
      ["Add a balancing entry so the reports match.", 0],
    ],
    why: "Investigating while keeping your manager informed is best. A made-up balancing entry hides the problem and is the most damaging.",
  },
  {
    scenario: "A client emails asking you to change the bank account their payments go to.",
    actions: [
      ["Call the client on the number already held on file to check the request before doing anything.", 3],
      ["Forward the email to your manager to check.", 2],
      ["Reply to the email asking them to confirm.", 1],
      ["Update the account details as asked.", 0],
    ],
    why: "Changed bank details are a common fraud. Checking through a trusted channel you already hold is the right control; replying to the same email can reach the fraudster.",
  },
  {
    scenario: "You are working on a deal. A friend who works at the company being bought messages you about rumours.",
    actions: [
      ["Don't discuss it, and tell compliance about the contact.", 3],
      ["Reply that you can't talk about work.", 2],
      ["Ignore the message.", 1],
      ["Tell them not to worry because it will be good news.", 0],
    ],
    why: "Deal information must stay confidential, and compliance needs to know about contact like this. Hinting at the outcome leaks inside information.",
  },
  {
    scenario: "Your manager is away and a trade needs approval above your limit.",
    actions: [
      ["Find the designated cover approver and ask them to approve it.", 3],
      ["Tell the desk the trade must wait until your manager returns.", 2],
      ["Ask a colleague at your level to approve it.", 1],
      ["Approve it yourself because your manager would agree.", 0],
    ],
    why: "Approval limits exist for control. The cover approver keeps business moving within the rules; approving above your limit breaks them.",
  },
  {
    scenario: "You are asked to present your team's results to senior leaders and you feel nervous.",
    actions: [
      ["Prepare your key messages, practise with a colleague and ask your manager for feedback.", 3],
      ["Prepare thoroughly on your own.", 2],
      ["Read directly from a script on the day.", 1],
      ["Ask to be taken off the presentation.", 0],
    ],
    why: "Preparation plus feedback builds confidence and quality. Avoiding the task misses a development opportunity.",
  },
  {
    scenario: "You notice repeated cash withdrawals on a customer's account, each just below a reporting threshold.",
    actions: [
      ["Report it through the firm's suspicious activity process.", 3],
      ["Ask your manager whether it looks unusual.", 2],
      ["Keep an eye on the account for a few more weeks.", 1],
      ["Ask the customer why they are withdrawing so much cash.", 0],
    ],
    why: "Possible money laundering must be reported through the proper channel. Asking the customer could alert them, which can itself be an offence.",
  },
];

type RK = { scenario: string; best_first: string[]; why: string };

const RANK: RK[] = [
  {
    scenario: "Rank these tasks in the order you should do them today, most urgent first.",
    best_first: [
      "Reply to a customer complaint that needs an answer today.",
      "Finish a manager's request that is due in three days.",
      "Start the college assignment due next week.",
      "Tidy the shared drive.",
    ],
    why: "Urgency and impact come first: a customer waiting today, then the nearest deadline, then later work, then low-value tidying.",
  },
  {
    scenario: "You are given a task you do not fully understand. Rank your responses from best to worst.",
    best_first: [
      "Check notes and guidance, then ask your manager specific questions.",
      "Ask a colleague who has done it before, then confirm with your manager.",
      "Start and see whether it becomes clear.",
      "Guess based on a similar task and submit it.",
    ],
    why: "Trying first and then asking precise questions shows initiative and avoids wasted work. Guessing and submitting risks serious errors.",
  },
  {
    scenario: "You discover a mistake in work you have already handed in. Rank these actions from best to worst.",
    best_first: [
      "Tell your manager straight away and suggest how to fix it.",
      "Fix it and then explain to your manager what happened.",
      "Fix it quietly and say nothing.",
      "Hope nobody notices.",
    ],
    why: "Prompt honesty with a solution is best. Fixing quietly is better than ignoring it, but hides information others may need.",
  },
  {
    scenario: "You see something unsafe at work that could hurt someone soon. Rank these actions from best to worst.",
    best_first: [
      "Warn anyone at immediate risk, then report it to your supervisor straight away.",
      "Report it to your supervisor straight away and get on with your work.",
      "Mention it at the next team meeting.",
      "Assume someone else has noticed.",
    ],
    why: "Protect people in immediate danger first, then report so it gets fixed. Reporting without warning anyone leaves people at risk in the meantime. Waiting for a meeting delays action, and assuming someone else knows is the most dangerous.",
  },
  // Finance workplace scenarios.
  {
    scenario: "It is 4pm on a busy day. Rank these tasks, most urgent first.",
    best_first: [
      "Correct a trade booking error before tonight's settlement cut-off.",
      "Send a client the meeting pack they asked for by the end of today.",
      "Update the weekly team report due on Friday.",
      "Clear out old emails.",
    ],
    why: "A settlement error has a hard deadline tonight and real cost, then a client promise due today, then later work, then housekeeping.",
  },
  {
    scenario: "A client says their statement shows a fee they don't recognise. Rank these responses from best to worst.",
    best_first: [
      "Listen, check their account, and explain the fee or put it right if it was wrong.",
      "Explain the fee schedule and offer to check their account later.",
      "Send them a copy of the terms and conditions.",
      "Tell them all fees are correct.",
    ],
    why: "Checking the specific account and acting on what you find treats the customer fairly. Dismissing the query without checking is worst.",
  },
  {
    scenario: "Your spreadsheet model gives a different answer from last month with the same inputs. Rank these actions from best to worst.",
    best_first: [
      "Tell your manager, stop the numbers being used, then investigate the cause.",
      "Investigate the cause, then tell your manager what you found.",
      "Mention it at next week's team meeting.",
      "Send the numbers out as normal.",
    ],
    why: "Unexplained changes could mean an error, so stop the numbers spreading first. Sending them out regardless risks decisions based on wrong figures.",
  },
  {
    scenario: "A new joiner asks how to do a task you know well. Rank your responses from best to worst.",
    best_first: [
      "Show them step by step and check they can do it themselves.",
      "Send them the written guide and offer to help if they get stuck.",
      "Do it for them this time.",
      "Tell them you're too busy.",
    ],
    why: "Teaching builds the team's ability. Doing it for them helps once but they learn nothing; refusing helps no one.",
  },
  {
    scenario: "A teammate's pitch slides, due in an hour, contain obvious errors. Rank your responses from best to worst.",
    best_first: [
      "Point out the errors clearly and kindly now, with suggested fixes.",
      "Fix the errors yourself and tell them what you changed.",
      "Mention the errors after the pitch.",
      "Say the slides look fine.",
    ],
    why: "Timely, constructive feedback lets your teammate fix their own work before the client sees it. Saying nothing lets errors reach the client.",
  },
  {
    scenario: "An email that appears to be from IT asks you to confirm your password. Rank these actions from best to worst.",
    best_first: [
      "Don't click anything, and report it with the firm's phishing button or to IT security.",
      "Delete it.",
      "Forward it to colleagues to warn them.",
      "Reply with your password so you keep access.",
    ],
    why: "Reporting lets security block it for everyone. Deleting protects only you, forwarding spreads the risky link, and replying hands over your account.",
  },
];

export function buildSjt(): { mostLeast: Item[]; rateEach: Item[]; rank: Item[] } {
  const mostLeast = MOST_LEAST.map((s, i): Item => {
    const r = rng(30000 + i);
    const texts = r.shuffle([s.best, ...s.others, s.worst]);
    return {
      id: `sjt-ml-${i + 1}`,
      kind: "most-least",
      prompt: s.scenario,
      options: texts,
      most: texts.indexOf(s.best),
      least: texts.indexOf(s.worst),
      explanation: s.why,
      difficulty: 3,
    };
  });
  const rateEach = RATE_EACH.map((s, i): Item => {
    const r = rng(31000 + i);
    const actions = r.shuffle(s.actions);
    return {
      id: `sjt-re-${i + 1}`,
      kind: "rate-each",
      prompt: s.scenario,
      actions: actions.map((a) => a[0]),
      ratings: actions.map((a) => a[1]),
      explanation: s.why,
      difficulty: 3,
    };
  });
  const rank = RANK.map((s, i): Item => {
    const r = rng(32000 + i);
    let options = r.shuffle(s.best_first);
    // Never show the options already in the right order.
    while (options.every((o, k) => o === s.best_first[k])) options = r.shuffle(s.best_first);
    return {
      id: `sjt-rk-${i + 1}`,
      kind: "rank",
      prompt: s.scenario,
      options,
      order: s.best_first.map((t) => options.indexOf(t)),
      explanation: s.why,
      difficulty: 3,
    };
  });
  return { mostLeast, rateEach, rank };
}

export const SJT = buildSjt();
