// Stretch situational judgement items. Hand-written and original. Unlike the foundation bank in sjt.ts, every option
// here is something a reasonable person might do and each carries some merit; the key turns on a trade-off (speed
// against process, loyalty against honesty, helpfulness against authority) and is explained by the principle that
// settles it. Distractors are plausible, not absurd, and the right answer is not written to be the longest.
// Keys follow published employer behaviours (ownership, honesty, escalation to the right person, safety, respect for
// confidentiality and authority limits). Real tests are scored against each employer's own expert key, which is not
// public: see docs/research/19-sjt-design.md.

import { rng } from "@/lib/assess/rng";
import type { Item } from "@/lib/assess/types";

type ML = { scenario: string; best: string; others: [string, string]; worst: string; why: string };
type RE = { scenario: string; actions: [string, number][]; why: string };
type RK = { scenario: string; best_first: [string, string, string, string]; why: string };

const MOST_LEAST: ML[] = [
  {
    scenario:
      "You are an apprentice in a bank's operations team. While reconciling payments you find a £48,000 transfer that was booked twice. Your team leader is on holiday until Monday and the client's statements go out tonight.",
    best: "Tell the duty manager now, with both booking references.",
    others: [
      "Reverse the duplicate yourself because you have the access, it fixes the client's balance before tonight, and you will note it clearly in the log.",
      "Email your team leader on holiday with the details so that they can decide how it should be handled when they are back.",
    ],
    worst: "Change the figure on the statement template so the client sees the right balance, and say nothing.",
    why: "Whoever is covering for your team leader needs to know before the error reaches the client. Reversing it alone skips the second-person check that exists for exactly this kind of change, and emailing someone on leave does not get a decision in time. Altering the statement hides the error and is the most harmful choice.",
  },
  {
    scenario:
      "A colleague two years ahead of you asks you to sign off the test results you worked on together. They say \"just tick the boxes, we always do\". You did not run two of the checks.",
    best: "Say you will sign once the two missing checks are done, and offer to run them now together.",
    others: [
      "Sign it as asked, because they know how the team works, have been here longer, and you do not want to slow the project down.",
      "Sign it so as not to hold things up, but tell your manager afterwards that two of the checks were not run.",
    ],
    worst: "Refuse to sign and tell the rest of the team that checks are routinely skipped in this team.",
    why: "A sign-off is a statement that the work was done. Offering to do the missing work keeps the standard and the relationship. Signing and reporting later still puts a false statement on record, and announcing it to the team turns a fixable issue into a public accusation.",
  },
  {
    scenario:
      "During a trial of a non-safety-critical test rig you notice a sensor reading drifting 3% above spec. The logged tolerance is ±2%. Your supervisor glances at it and says the drift is normal and to carry on.",
    best: "Log the reading and tolerance, and ask your supervisor to confirm in writing that continuing is acceptable.",
    others: [
      "Carry on with the trial as instructed, then mention the drift to the quality engineer when you see them at lunch.",
      "Stop the trial yourself until someone more senior has looked at the data, since the reading is outside the stated tolerance.",
    ],
    worst: "Adjust the logged values to within tolerance so that the trial data stays usable and nobody has to repeat the run.",
    why: "The supervisor holds the responsibility, so overriding them is disproportionate when nothing is safety-critical, but silence is not acceptable either. A written record plus a request to confirm keeps the data honest and puts the decision where it belongs. Changing the logged values falsifies the trial.",
  },
  {
    scenario:
      "You are on a software team. You spot a hard-coded database password in code a teammate pushed this morning. The repository is private.",
    best: "Message your teammate privately, ask them to change the password and remove it, and offer to help.",
    others: [
      "Raise it in the team channel so that everyone learns to check for this kind of thing before they push.",
      "Remove it in a new commit yourself to save time, and let your teammate know afterwards what you did.",
    ],
    worst: "Leave it, because the repository is private, the team has bigger priorities, and nobody outside will see it.",
    why: "Removing the line does not remove the password from the history, so it needs changing, and the owner of the code is the right first contact. Posting it to the whole channel embarrasses a colleague for no extra benefit, and fixing it silently teaches nothing. Ignoring it leaves a live credential exposed.",
  },
  {
    scenario:
      "You are on a client site for an audit. The client's finance manager offers you a spreadsheet \"to save time\" that includes staff salaries, which was not part of your sampling request.",
    best: "Say you will take only what the request covers, and ask your senior whether more is needed.",
    others: [
      "Take the spreadsheet in case it turns out to be useful, and delete the parts you do not need later.",
      "Accept it and tell your senior that you now have it so that they can decide what to do with it.",
    ],
    worst: "Decline and tell the client's director that their finance team is being careless with staff data.",
    why: "Only collecting what the engagement needs protects both the client and the firm, and your senior decides whether more is required. Taking it first means you now hold sensitive data without a reason. Lecturing the client's director is not your place and damages the relationship.",
  },
  {
    scenario:
      "You process benefit claims. A claimant phones, distressed, and asks you to confirm their former partner's address. They say the partner has left and they need to reach them.",
    best: "Explain you cannot share it, listen to why they need it, and pass it to your supervisor for the right route.",
    others: [
      "Tell them only the area the partner lives in, so that you are as helpful as you can without giving the full address.",
      "Say you cannot discuss it and end the call politely, because the rules on personal data are clear.",
    ],
    worst: "Read out the address if the caller can correctly answer the partner's security questions, since that shows a real link.",
    why: "Personal data about someone else is not yours to release, and a caller who knows the security answers could still be a risk. Listening and passing the underlying need on to the right person helps without breaching confidentiality. Ending the call coldly fails a distressed person, and sharing even the area is still disclosure.",
  },
  {
    scenario:
      "On a construction site you see a subcontractor working at height without a harness. Your site manager is nearby, on the phone, with their back to the scaffold.",
    best: "Ask the worker to stop and come down safely, then tell the site manager.",
    others: [
      "Wait until the site manager finishes the call, so that you can point it out to the person in charge of safety.",
      "Call out a warning across the site so that the manager hears it and deals with the situation.",
    ],
    worst: "Take a photo for the safety record and report it properly at the end of the shift.",
    why: "Anyone on site can stop unsafe work, and immediate risk of a fall comes before any reporting. Waiting or shouting to someone else leaves the person at risk for longer. Documenting it for later while the risk continues is the weakest response.",
  },
  {
    scenario:
      "A friend on your team was late because they overslept, and asks you to say they were at a client meeting. Your manager then asks you where your friend was this morning.",
    best: "Say you do not know their movements and suggest the manager asks them directly.",
    others: [
      "Say they were in a meeting, since it is only a one-off and nobody is harmed by it.",
      "Tell your manager the full truth, including that your friend overslept, so that nothing is hidden.",
    ],
    worst: "Warn your friend that the manager is asking, and agree a story between you before anyone else asks.",
    why: "You should not lie for a colleague, and you should not report on them either when you were not asked to monitor them. Saying what you honestly know and pointing the manager to the person concerned keeps you honest without making you a witness. Agreeing a story together makes you part of the deception.",
  },
  {
    scenario:
      "A client rings under pressure and asks you to \"just confirm\" that their payment has gone through because they have a supplier waiting. Your system shows the payment as pending.",
    best: "Tell them it shows as pending, explain what that means and the usual timescale, and note their urgency.",
    others: [
      "Tell them it should arrive today, because that is how quickly payments of this kind normally move.",
      "Say you cannot discuss payments over the phone and ask them to ring the main customer line.",
    ],
    worst: "Tell them it has gone through to ease the pressure, and sort out any difference with the team later.",
    why: "Give the client what is true now and something useful to do with it. A prediction can turn out wrong and cost them, and pushing them away helps nobody. Saying something is done when it is not is dishonest, and the client may act on it.",
  },
  {
    scenario:
      "Your manager has asked you to prioritise Project A this week. A senior engineer from Project B asks you for urgent help with something that would take about two hours.",
    best: "Tell the engineer you need to check priorities, and ask your manager now if the two hours can be spared.",
    others: [
      "Help the engineer straight away, since they are more experienced than you and two hours is not very long.",
      "Tell the engineer you are committed to Project A this week and so cannot help at all.",
    ],
    worst: "Say yes to the engineer, then do both jobs by working evenings without telling either of them.",
    why: "Priorities are your manager's to set, so check rather than decide for yourself, and do it quickly because the other need is urgent. Helping on your own initiative undermines the plan, and a flat refusal ignores a real business need. Quietly absorbing both hides the capacity problem.",
  },
  {
    scenario:
      "Your latest software release is live and customers are reporting errors. You think your change caused it but you are not sure. Your team lead is in a meeting for another hour.",
    best: "Post what you know and suspect in the incident channel, and interrupt the lead if errors continue.",
    others: [
      "Roll your change back at once without telling anyone, because that is the fastest way to stop the errors.",
      "Wait until the lead is out of the meeting so that you do not interrupt something important.",
    ],
    worst: "Keep investigating on your own until you are certain of the cause, then report back with a fix.",
    why: "In an incident, visibility matters as much as speed: people need to know what is happening so they can decide together. A silent rollback may be right but nobody else can plan around it, and waiting or working alone leaves customers affected and the team in the dark.",
  },
  {
    scenario:
      "You realise you made an error in a spreadsheet sent to a client last week. It undercharged them by £120. The client has not noticed.",
    best: "Tell your manager what happened and propose how to correct it with the client.",
    others: [
      "Correct it in the next version of the spreadsheet without drawing the client's attention to the earlier error.",
      "Leave it, since the amount is small, the mistake is in the client's favour and nobody has noticed.",
    ],
    worst: "Quietly change last week's file on the shared drive so that the records match the corrected amount.",
    why: "Errors are reported when you find them, even small ones and even when nobody has noticed, because the decision about how to correct them belongs to your manager and the client relationship. Fixing it silently or leaving it hides the error, and rewriting a record that was already sent is the most serious breach.",
  },
  {
    scenario:
      "Your degree provider has set an assignment deadline that falls in a busy fortnight at work. Your manager says that work has to come first.",
    best: "Ask your manager and tutor together to agree a plan that protects your study time.",
    others: [
      "Do the assignment in your evenings and weekends so that neither work nor study is affected by the clash.",
      "Tell your tutor you will submit late because of work, and let your manager know afterwards.",
    ],
    worst: "Do the minimum on the assignment so you can give work your full attention, and hope it passes.",
    why: "Your apprenticeship includes protected time for study, and both parties need to agree how to handle a clash. Absorbing it in your own time is unsustainable and tells nobody there is a problem, and deciding to submit late on your own does not involve your employer. Cutting corners puts your qualification at risk.",
  },
  {
    scenario:
      "At lunch, a friend who holds shares in a company related to your firm asks whether the firm is about to announce a big client win. You have seen an internal email about it.",
    best: "Tell them you cannot discuss anything that is not public, and let compliance know about the conversation.",
    others: [
      "Say you cannot comment and change the subject, and leave it at that without telling anyone.",
      "Say you cannot say, but hint that they might want to be patient before they decide to sell.",
    ],
    worst: "Tell them to make their own decision, and add that things look positive for the firm.",
    why: "Anything that could affect a share price before it is announced must not be shared, including hints. Being asked is the kind of thing compliance teams expect to hear about, so telling them protects you as well as the firm. Hinting is still passing on inside information, and the other options leave the approach unreported.",
  },
  {
    scenario:
      "A senior colleague shows you a quicker way to run a routine test that skips one documented step. They say it works and everyone uses it.",
    best: "Ask whether the shortcut is approved and, if not, suggest raising it with the process owner.",
    others: [
      "Use it this once, as your senior colleague does, and watch for any problems that it might cause.",
      "Follow the documented step as normal and say nothing about the shortcut to anyone.",
    ],
    worst: "Share the shortcut with the other apprentices so that everyone on the team saves time.",
    why: "A documented step usually exists for a reason you cannot see yet. Asking whether it is approved respects your colleague and the process, and routes a possible improvement to someone who can authorise it. Using it silently or spreading it pushes unapproved practice further, and saying nothing wastes a possible improvement.",
  },
  {
    scenario:
      "A customer demands a refund that policy does not allow. A colleague granted similar refunds last week.",
    best: "Explain the policy, check with your supervisor about the earlier refunds, and say when you will come back.",
    others: [
      "Grant the refund, so that customers are treated consistently with the refunds given last week.",
      "Refuse politely and add that last week's refunds were a mistake that should not have been made.",
    ],
    worst: "Tell the customer you will refund them, but record it under a different reason code.",
    why: "Consistency matters, but the way to get it is to check with someone who can decide, and to give the customer a clear next step. Granting it yourself or criticising a colleague's decision both go beyond what you know. Disguising the refund is dishonest and could be treated as misconduct.",
  },
  {
    scenario:
      "A teammate has not delivered their part of a joint presentation that is due tomorrow morning. You suspect they are struggling.",
    best: "Ask them privately how you can help, and agree a time tonight to check progress.",
    others: [
      "Tell your manager that they have not delivered, so that it can be dealt with in good time.",
      "Write their section yourself tonight so that the presentation goes ahead as planned tomorrow.",
    ],
    worst: "Present your part and tell the room that the rest was missed by your teammate.",
    why: "The deadline is close, so act now, and start with the person, because they may just need help or a short extension. A fixed check-in time keeps it from drifting and still lets your manager be told if it fails. Doing their work for them hides the problem, and blaming them in public damages trust.",
  },
  {
    scenario:
      "You find a printed list of customer names and account numbers in the shared printer tray.",
    best: "Take it somewhere secure and report it to your manager or the data protection lead.",
    others: [
      "Shred it straight away so that nothing about those customers can leak any further.",
      "Ask around the office to find out who printed it, so that you can hand it straight back.",
    ],
    worst: "Leave it in the tray with a note asking the owner to come and collect it.",
    why: "A found list of personal data is a possible incident, which is reported so the cause can be found, not just cleaned up. Shredding destroys the evidence that anything happened, and asking round the office spreads the details further. Leaving it exposed in the tray is the worst because anyone can read it.",
  },
  {
    scenario:
      "You are testing a new app feature. It works as specified, but you notice that it collects users' location data without a clear consent screen.",
    best: "Describe what you saw to the product owner, ask whether privacy has reviewed it, and hold your sign-off.",
    others: [
      "Sign off the test, since it works as specified, and add a comment about the missing consent screen.",
      "Report the feature to the data protection regulator, because users' location data is involved.",
    ],
    worst: "Remove the location collection from the code yourself before the release goes out.",
    why: "Raising it through the people who own the feature, and pausing your own sign-off until they respond, uses the proper route. Signing off with a comment lets it ship on your approval. Going straight to a regulator skips your own organisation, and changing the code yourself oversteps your role and could break the feature.",
  },
  {
    scenario:
      "You have an idea to cut a weekly three-hour manual task to thirty minutes with a short script. The task handles sensitive client data and your manager has not asked for changes.",
    best: "Write up the idea and its risks, check data handling is allowed, and propose a small trial.",
    others: [
      "Build the script in your own time so that you can show your manager how well it works first.",
      "Ask a more senior colleague to suggest the idea to your manager on your behalf.",
    ],
    worst: "Start using the script on the live data to prove how much time it saves.",
    why: "Initiative is valued when it is controlled: you show the benefit and the risks, and the owner of the process agrees how to test it. Building it quietly can create work your manager did not agree to, and passing the idea on through someone else loses your ownership. Running it on live sensitive data is a breach.",
  },
  {
    scenario:
      "A senior trader misses the cut-off for a trade and asks you to book it at yesterday's closing price, saying it will cost the firm nothing.",
    best: "Say you cannot book outside the rules and suggest they take it to the head of desk.",
    others: [
      "Book it as asked, because they are senior and it costs nothing, and tell your supervisor afterwards.",
      "Tell them you will check with your supervisor when you next see them, and hold off until then.",
    ],
    worst: "Book it and keep a note of the request in case anyone asks about it later.",
    why: "A trade booked at a price the market never offered is a control failure however little it costs, and seniority does not change that. Declining while pointing to the right authority respects both. Booking it first, even with a note, treats the rule as optional, and an unclear delay leaves the trader to find another way.",
  },
  {
    scenario:
      "A member of the public at your counter becomes aggressive when you tell them they are not eligible for a service.",
    best: "Stay calm, acknowledge their frustration, restate the decision and the appeal route, and call a colleague if needed.",
    others: [
      "Explain the eligibility rules in full detail until they understand exactly why the decision was made.",
      "Pass them to a colleague straight away so that you do not have to deal with the situation.",
    ],
    worst: "Tell them to calm down or you will end the conversation and call security.",
    why: "Acknowledging feelings and giving a clear next step lowers the temperature while keeping the decision. More explanation alone rarely helps an angry person, and handing them over immediately avoids the situation you are there to handle. Threatening to end the conversation is likely to escalate it.",
  },
  {
    scenario:
      "You are due to hand over site drawings today. You notice a dimension that looks wrong, but your supervisor has already approved the set.",
    best: "Show your supervisor the dimension and why it looks wrong, and ask them to check it first.",
    others: [
      "Hand the drawings over as approved, and mention the dimension in your covering email to the client.",
      "Correct the dimension yourself and send out the updated set so that the error never reaches site.",
    ],
    worst: "Say nothing, since your supervisor has already approved them and it is their responsibility.",
    why: "Approval does not remove your responsibility to speak up about something you have spotted, and the person who approved the drawings is the one to re-check them. Mentioning it in an email puts the problem in someone else's inbox after the drawings are out, and changing the dimension yourself oversteps your role.",
  },
  {
    scenario:
      "You are organising a team social. A colleague mentions that they cannot join late evening events or those centred on alcohol for religious reasons.",
    best: "Ask your colleague and the team what would work for everyone, and suggest a daytime option.",
    others: [
      "Plan the usual event and say that your colleague is welcome to come along for a short while.",
      "Run two separate events, one for people who drink and one for those who prefer not to.",
    ],
    worst: "Arrange the event as planned and tell your colleague to say if it is a problem.",
    why: "Inclusion means planning with people's needs in mind, not asking them to opt out. Involving the team in picking something that works for everyone is the most respectful. Allowing a short visit or splitting the team still treats one person as the exception, and waiting for a complaint puts the burden on them.",
  },
];

const RATE_EACH: RE[] = [
  {
    scenario:
      "A colleague tells you in confidence that they keep mistyping client account numbers and some payments may have gone to the wrong place.",
    actions: [
      ["Encourage them to report it to the manager today, explain why it cannot wait, and offer to go with them for support when they do.", 3],
      ["Tell your manager yourself, naming your colleague, because customers' money may be at risk and it needs dealing with quickly.", 2],
      ["Offer to double-check their entries for the next few days so that no further mistakes reach customers.", 1],
      ["Say nothing, because they told you in confidence and you promised to keep it to yourself.", 0],
    ],
    why: "Customer money may be affected, so this cannot stay confidential. Supporting your colleague to report it themselves is best because it is quick and keeps their trust. Reporting for them is acceptable if they will not. Checking future entries does nothing about past payments.",
  },
  {
    scenario:
      "Your lead asks you for a time estimate. You think the task will take five days; your lead is hoping for two.",
    actions: [
      ["Explain what drives your estimate, and say what could be cut to fit two days.", 3],
      ["Give five days and explain carefully what is behind the number, then leave the decision with your lead.", 2],
      ["Agree to two days and work extra hours to meet it, so that you do not let your lead down.", 1],
      ["Agree to two days to avoid a disagreement and hope that it all works out in the end.", 0],
    ],
    why: "A good estimate comes with the reasoning and options. Giving an honest number with its drivers helps, and offering a trade-off helps most. Promising what you do not believe is achievable hides the risk until it is too late.",
  },
  {
    scenario:
      "You are asked to clean a machine, but the lock-out tag on it belongs to a colleague who has gone home.",
    actions: [
      ["Leave the machine and tell your supervisor you cannot work on it until the tag is released properly.", 3],
      ["Phone your colleague at home to ask whether it is safe to proceed, and wait for their answer before doing anything.", 2],
      ["Clean everything except the area around the tag, so that you finish the job without touching the lock.", 0],
      ["Remove the tag because the machine looks idle and the cleaning needs to be done before the next shift.", 0],
    ],
    why: "A lock-out tag protects the person who put it on, and only they or an authorised procedure may release it. Stopping and telling your supervisor is the safest. Calling your colleague is an attempt to follow the rule but should still go through the supervisor. Working around the tag or removing it risks serious injury.",
  },
  {
    scenario:
      "You realise you copied another customer into an email to a customer, so their name and email address are visible.",
    actions: [
      ["Report it to your manager immediately and ask how both customers should be told.", 3],
      ["Ask the people who received it to delete the message, explaining the mistake, and then report it.", 2],
      ["Recall the email and, if the recall appears to work, do nothing further because nobody has read it.", 1],
      ["Wait to see whether either customer complains before deciding whether it needs to be raised.", 0],
    ],
    why: "This is a data incident and should be reported as soon as you know, so the right people can decide what to tell customers. Contacting the recipients can help but should not come first on your own. A recall is not proof that it was not read, and waiting delays any remedy.",
  },
  {
    scenario:
      "Two teammates are arguing about how to split a task, and the argument is slowing the team's work.",
    actions: [
      ["Suggest a short chat with both of them together to agree who does what against the deadline, and offer to help work out a fair split.", 3],
      ["Tell your manager what is happening so that they can decide how the task should be split between them.", 2],
      ["Take the task yourself so that the argument stops and the team can get back to the deadline.", 1],
      ["Side with the teammate you get on best with, since that is likely to settle it fastest.", 0],
    ],
    why: "As a peer, helping them agree against the shared deadline respects both people. Involving your manager is reasonable if that fails. Taking the task avoids the conflict without resolving it, and taking sides makes it worse.",
  },
  {
    scenario:
      "You are asked to use a software tool you have never used, and the work is due tomorrow.",
    actions: [
      ["Read the guidance for an hour, then ask a colleague to check your understanding.", 3],
      ["Watch a training video for the tool and then start the task, asking for help only if you get stuck.", 2],
      ["Learn as you go and fix any problems that you notice afterwards, once the main work is done.", 1],
      ["Say you already know it so that you do not seem unprepared in front of your manager.", 0],
    ],
    why: "Learning quickly and checking your understanding with someone who knows the tool gives the best chance of getting it right first time. Teaching yourself alone is fine but riskier. Claiming experience you do not have causes errors and loses trust.",
  },
  {
    scenario:
      "A client offers you tickets to a sports event the week before they ask your team for a favourable decision.",
    actions: [
      ["Decline politely, explain the gifts policy, and mention the offer to your manager.", 3],
      ["Ask your manager whether the firm allows it before you reply to the client's offer.", 2],
      ["Accept the tickets and record them straight away in the gifts register, so that everything is transparent.", 1],
      ["Accept and attend, because you would never let a day out affect a decision you make at work.", 0],
    ],
    why: "Hospitality offered around a decision creates a conflict of interest whether or not it influences you. Declining and telling your manager is best. Asking first is acceptable. Recording a gift you should not have taken does not undo it, and attending anyway is the worst because the appearance of influence is the problem.",
  },
  {
    scenario:
      "On an audit you cannot reconcile a ledger balance to the supporting documents. The client contact is unreachable and your senior says the deadline cannot move.",
    actions: [
      ["Write down exactly what you tested and could not resolve, and tell your senior now.", 3],
      ["Ask a colleague who worked on this client last year if you can see their working papers.", 2],
      ["Keep trying on your own until you find the cause, even if it takes you past the deadline.", 1],
      ["Mark the difference as 'unreconciled' with no explanation, so that you can move on to the next area.", 0],
    ],
    why: "An honest record of what was done, and an early warning to the person who owns the deadline, gives the senior options. Looking at previous papers is useful. Working alone and late helps no one if the cause is not findable, and hiding the gap makes the file misleading.",
  },
  {
    scenario:
      "A member of the public asks you about a rule you are not sure about.",
    actions: [
      ["Say you will check, give a clear time to come back to them, and then find out from the official guidance or a colleague.", 3],
      ["Direct them to the right page of the website and offer to help them find the answer they need.", 2],
      ["Give your best guess and tell them you might be wrong, so that they have something to go on.", 1],
      ["Give a confident answer so that you appear knowledgeable and the person leaves feeling reassured.", 0],
    ],
    why: "A right answer later is worth more than a fast uncertain one, and a clear time to come back keeps the person informed. Pointing to the right guidance helps if you stay with them. Guessing can mislead someone who relies on it, and false confidence is the worst.",
  },
  {
    scenario:
      "You see a delivery vehicle reversing without a banksman near a route used by pedestrians on a construction site.",
    actions: [
      ["Signal the driver to stop and keep people clear until a banksman arrives.", 3],
      ["Radio the site manager, tell them what you can see, and wait for their instructions on what to do.", 2],
      ["Shout to nearby workers to be careful because a vehicle is reversing close to the walkway.", 1],
      ["Note the registration plate and report it properly at the end of the day, when you have time.", 0],
    ],
    why: "Immediate danger to people comes first, so stop the vehicle and protect others if you can do it safely. Informing the manager is right but slower. Warning bystanders addresses only part of the risk, and a report later does nothing about the danger now.",
  },
  {
    scenario:
      "A colleague emails you a long complaint about your team's turnaround time and copies in their director.",
    actions: [
      ["Acknowledge it quickly, tell your manager, and gather the facts on turnaround.", 3],
      ["Phone the colleague to talk it through before you write a formal reply to their email and their director.", 2],
      ["Apologise and promise faster turnaround from now on, to show that you take the complaint seriously.", 1],
      ["Reply to everyone on the email to show clearly why the colleague's complaint is wrong.", 0],
    ],
    why: "A quick acknowledgement, with your manager informed and the facts ready, deals with it professionally. Speaking directly can also help. A promise you cannot control is risky, and a public rebuttal escalates a complaint that should be settled calmly.",
  },
  {
    scenario:
      "You notice a colleague claiming expenses for a taxi that you know they did not take.",
    actions: [
      ["Report it to your manager or the whistleblowing route, and say what you saw.", 3],
      ["Speak to your colleague privately and ask them to correct the claim before anyone else finds out.", 2],
      ["Do nothing because it is only a small amount and not worth causing a fuss over.", 1],
      ["Mention it to other colleagues to see whether they have noticed the same thing about the claims.", 0],
    ],
    why: "False expenses are dishonesty however small, and reporting through the proper route is the expected response. A private word may resolve it but leaves the matter unrecorded. Ignoring it condones it, and gossiping damages the colleague without addressing the issue.",
  },
];

const RANK: RK[] = [
  {
    scenario:
      "You are preparing a client report and notice that another team's figures conflict with yours. Rank the actions from most to least effective.",
    best_first: [
      "Check your own working, then raise the discrepancy with the other team's owner with both sets of figures.",
      "Ask your manager which source to use and note the difference in the report.",
      "Use the other team's figures because theirs is the official source.",
      "Use your own figures because you know how you built them.",
    ],
    why: "Check your own work first, then take the evidence to the person who owns the other numbers. Asking your manager is sensible but passes the problem upward. Picking either set without investigating risks presenting a wrong number as fact.",
  },
  {
    scenario:
      "Your manager is on leave and a client rings with a complaint you could settle with a small goodwill gesture that is beyond your authority. Rank the actions.",
    best_first: [
      "Acknowledge the complaint, explain you will get authority, give a time to come back, and contact the deputy manager.",
      "Give the client the manager's out-of-office contact details.",
      "Tell the client the manager will call them back when they return.",
      "Offer the goodwill gesture and ask for approval afterwards.",
    ],
    why: "Staying within your authority while still moving the complaint forward is best. Passing on contact details and telling the client to wait are passive but safe. Making an offer you cannot authorise commits the firm without permission.",
  },
  {
    scenario:
      "You think a process step in your team is unnecessary and slows everyone down. Rank the actions.",
    best_first: [
      "Find out why the step exists, then propose a change with evidence if it still looks unnecessary.",
      "Propose removing it to your manager with figures on the time it costs.",
      "Complain about it to teammates.",
      "Skip it when you are busy.",
    ],
    why: "Understanding why a step exists comes before changing it. A proposal with figures is a good second. Complaining changes nothing, and quietly skipping it breaks the process and may cause problems others cannot see.",
  },
  {
    scenario:
      "A bug that affects customers has gone live, introduced by a teammate who is offline. Rank the actions.",
    best_first: [
      "Tell your lead and follow the incident process, including a rollback if that is the agreed first step.",
      "Try to reach your teammate while you gather logs for the lead.",
      "Investigate alone until you understand the cause fully.",
      "Wait until your teammate is back online.",
    ],
    why: "Customers are affected, so the incident process comes first and your lead needs to know. Trying to reach the teammate helps if it does not replace that. Working alone delays everyone, and waiting leaves customers affected.",
  },
  {
    scenario:
      "A client asks you for information that you are not sure you are allowed to share. Rank the actions.",
    best_first: [
      "Say you will check and give a time, then ask your manager or compliance.",
      "Share only what is already on the public website and say you will confirm the rest.",
      "Share it, because the client seems entitled to it.",
      "Share it now and check afterwards.",
    ],
    why: "When you are unsure, do not release it until you have checked. Sharing only the public information is a cautious partial answer. Releasing it on an assumption, or before checking, cannot be undone.",
  },
  {
    scenario:
      "Your manager asks for volunteers to work on Saturday, but you have a college assignment due on Monday. Rank the actions.",
    best_first: [
      "Tell your manager about the college deadline and offer an alternative, such as extra time on Friday or help after you have submitted.",
      "Tell your manager you cannot because of college.",
      "Volunteer and finish the assignment late at night.",
      "Do not reply and hope you are not picked.",
    ],
    why: "Being open about the clash and offering a way to contribute is best. A plain refusal is honest but unhelpful. Overcommitting risks both pieces of work, and avoiding the question leaves your manager guessing.",
  },
  {
    scenario:
      "You are supporting a new apprentice who keeps making the same small mistake. Rank the actions.",
    best_first: [
      "Ask them to talk you through their process and agree a checklist together.",
      "Show them the right way again and ask them to repeat it.",
      "Fix the mistakes yourself quietly.",
      "Tell your manager that they are not learning.",
    ],
    why: "Finding out why the mistake happens helps most and gives them a tool they own. Demonstrating again helps if the cause is knowledge. Fixing it for them hides the pattern, and escalating too early gives up on the person.",
  },
  {
    scenario:
      "You are asked to test a prototype using equipment you have not been trained on. Rank the actions.",
    best_first: [
      "Say you have not had training and ask for it, or for supervision, before you start.",
      "Ask a colleague to show you informally and watch you first.",
      "Read the manual and start with low-risk tests.",
      "Use it because the tests need doing.",
    ],
    why: "Untrained use of equipment is a safety and quality risk, so ask for training or supervision first. Informal help is better than none. Reading the manual alone is weaker, and just proceeding is the riskiest.",
  },
  {
    scenario:
      "You made a mistake that cost the firm £500 and your manager has not noticed. Rank the actions.",
    best_first: [
      "Tell your manager what happened and how you will prevent it happening again.",
      "Quietly fix the process so that it cannot happen again.",
      "Wait and see if anyone notices.",
      "Say the system caused it.",
    ],
    why: "Owning a mistake promptly with a plan shows integrity. Fixing the process silently is useful but leaves the loss unreported. Waiting hides the error, and blaming the system when you know otherwise is dishonest.",
  },
  {
    scenario:
      "Your team leader asks for honest feedback on a new process you think is flawed, in front of the whole team. Rank the actions.",
    best_first: [
      "Give specific, constructive points and a suggestion for improvement.",
      "Say it is fine and raise your concerns privately afterwards.",
      "Say you have no feedback.",
      "Criticise the process in general terms.",
    ],
    why: "When feedback is invited, specific and constructive input with a suggestion is the most useful. Raising it afterwards still helps but wastes the opening. Saying nothing gives no information, and vague criticism cannot be acted on.",
  },
];

export function buildSjtHard(): { mostLeast: Item[]; rateEach: Item[]; rank: Item[] } {
  const mostLeast = MOST_LEAST.map((s, i): Item => {
    const r = rng(40000 + i);
    const texts = r.shuffle([s.best, ...s.others, s.worst]);
    return {
      id: `sjth-ml-${i + 1}`,
      kind: "most-least",
      prompt: s.scenario,
      options: texts,
      most: texts.indexOf(s.best),
      least: texts.indexOf(s.worst),
      explanation: s.why,
      difficulty: 4,
    };
  });
  const rateEach = RATE_EACH.map((s, i): Item => {
    const r = rng(41000 + i);
    const actions = r.shuffle(s.actions);
    return {
      id: `sjth-re-${i + 1}`,
      kind: "rate-each",
      prompt: s.scenario,
      actions: actions.map((a) => a[0]),
      ratings: actions.map((a) => a[1]),
      explanation: s.why,
      difficulty: 4,
    };
  });
  const rank = RANK.map((s, i): Item => {
    const r = rng(42000 + i);
    let options = r.shuffle(s.best_first);
    while (options.every((o, k) => o === s.best_first[k])) options = r.shuffle(s.best_first);
    return {
      id: `sjth-rk-${i + 1}`,
      kind: "rank",
      prompt: s.scenario,
      options,
      order: s.best_first.map((t) => options.indexOf(t)),
      explanation: s.why,
      difficulty: 4,
    };
  });
  return { mostLeast, rateEach, rank };
}

export const SJT_HARD = buildSjtHard();
