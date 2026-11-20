// Written guides for the Resources section. Each answers one question people actually search for. They describe common
// practice, not any one employer's rules, and link to the matching practice tool.

export type GuideSection = { heading: string; paragraphs?: string[]; bullets?: string[] };
export type Guide = {
  slug: string;
  title: string;
  /** Page and search title (kept under about 60 characters). */
  seoTitle: string;
  description: string;
  intro: string;
  sections: GuideSection[];
  cta: { href: string; label: string; blurb: string };
  related: string[];
  updated: string;
  /** Where the facts came from, shown at the foot of the guide. Used where a guide states specific rules, dates or formats. */
  sources?: { label: string; url: string }[];
};

export const GUIDES: Guide[] = [
  {
    slug: "degree-apprenticeship-vs-university",
    title: "Degree apprenticeship or university: how to choose",
    seoTitle: "Degree apprenticeship vs university: how to choose",
    description: "A fair comparison of degree apprenticeships and university: pay, debt, work experience, choice, competition and how to keep both options open.",
    intro:
      "Both routes lead to a degree. The difference is how you get there: studying full time and then looking for a job, or working for an employer and studying part time at the same time. Neither is better for everyone, so here is how to compare them honestly.",
    sections: [
      {
        heading: "What you get from a degree apprenticeship",
        bullets: [
          "A salary from day one, and your employer and the government pay the tuition fees, so you do not take out a student loan for the degree.",
          "Real work experience while you study, which employers value when you apply for later roles.",
          "A job with the organisation, usually with training towards professional qualifications as well as the degree.",
        ],
      },
      {
        heading: "What you give up",
        bullets: [
          "Choice. You study the degree your employer's programme offers, at a partner university, rather than picking any course anywhere.",
          "The full-time student experience. You work most of the week and study alongside, so there is less time for societies, travel and moving away.",
          "Easy second chances. Places are limited, each employer runs its own selection, and rejection is common, so you need to apply widely.",
        ],
      },
      {
        heading: "Questions to ask yourself",
        bullets: [
          "Do I already know the kind of career I want, or do I want time to explore it?",
          "Am I happy to work and study at the same time, week after week, for several years?",
          "Do I want to live near the employer's offices, or is moving away to study important to me?",
          "Does the subject I want (for example medicine) only exist at university?",
        ],
      },
      {
        heading: "You do not have to choose yet",
        paragraphs: [
          "Plenty of people apply for degree apprenticeships and to university through UCAS at the same time, and decide when offers arrive. Applications for degree apprenticeships often open in the autumn, and many close earlier than UCAS deadlines, so start by finding who is open now and what each employer asks for.",
        ],
      },
      {
        heading: "Side by side",
        bullets: [
          "How you apply: degree apprenticeships are advertised through the year, each with its own deadline, and UCAS says there is no application cycle like university's. University applications follow the UCAS calendar.",
          "How long it takes: UCAS says three to six years depending on the course level.",
          "How your time is split: about 80% working and 20% studying according to UCAS, and GOV.UK says at least 20% of working hours must be training.",
          "Money: you are paid a wage, with an apprentice minimum of £8 an hour in the first year on the April 2026 rates. The vacancies we read described the degree as funded, with no tuition fees for the apprentice.",
          "The qualification: GOV.UK lists Level 6 degree apprenticeships as equal to a bachelor's degree and Level 7 as equal to a master's.",
        ],
      },
      {
        heading: "Three things people get wrong",
        bullets: [
          "\"It is a lesser route.\" The degree level is the same: a Level 6 apprenticeship is equal to a bachelor's degree. What differs is how you get there and how much work experience you have when you finish.",
          "\"You have to pick one.\" UCAS says you are free to apply for multiple degree apprenticeships and traditional university courses at the same time.",
          "\"It is only engineering and IT.\" The 2027 vacancies we read include solicitor, surveying, supply chain, packaging, civil engineering, nuclear engineering and finance routes.",
        ],
      },
      {
        heading: "Places are limited, so keep both doors open",
        paragraphs: [
          "Some vacancies have very few places. The ones we read ranged from one to ten, so apply to several and keep your university applications going. If you are not sure which suits you, an honest pros and cons list with someone who knows you, such as a teacher or careers adviser, is worth more than any rule of thumb.",
        ],
      },
    ],
    cta: { href: "/opportunities", label: "See who is open now", blurb: "Every employer we cover, with open, closing soon and opening soon in one list." },
    related: ["what-is-a-degree-apprenticeship", "degree-apprenticeship-salary", "apprenticeship-levels-explained", "degree-apprenticeship-interview-questions"],
    updated: "2026-11-20",
  },
  {
    slug: "what-is-a-degree-apprenticeship",
    title: "What is a degree apprenticeship? A plain guide for 16 to 18 year olds",
    seoTitle: "What is a degree apprenticeship? A plain guide",
    description: "What a degree apprenticeship is, how it works week to week, who it suits, how long it takes and how to apply.",
    intro:
      "A degree apprenticeship is a full-time job with training, where you study part time for a bachelor's degree (Level 6) or sometimes a master's (Level 7). You are employed from the start, paid a wage, and graduate with a degree.",
    sections: [
      {
        heading: "How it works",
        paragraphs: [
          "You are hired by an employer and enrolled at a partner university or training provider. A typical week mixes work with study: some employers give you set days at university, others use blocks of study time. The programme usually lasts between three and six years, depending on the subject and employer.",
        ],
      },
      {
        heading: "Who offers them",
        paragraphs: [
          "Banks, accountancy and consulting firms, engineering and defence companies, technology firms, the public sector and many others. You can browse the employers we cover by sector and see which ones are open right now.",
        ],
      },
      {
        heading: "Who can apply",
        bullets: [
          "Most programmes are aimed at people finishing Level 3 study such as A-levels or T-levels, or who already have them, and many have a minimum UCAS tariff or specific subjects.",
          "Employers set their own requirements, so always read the advert. Some ask for particular GCSEs, such as Maths and English, and some need extra checks, for example for security.",
        ],
      },
      {
        heading: "How you apply",
        paragraphs: [
          "Usually directly to the employer through its careers page, with some roles also on the government's Find an Apprenticeship service. Most selection processes include an application form, online tests, a video interview and an assessment centre or final interview. Dates differ by employer, and many close early or when places are full.",
        ],
      },
      {
        heading: "How it works week to week",
        paragraphs: [
          "UCAS says about 80% of your time is work and about 20% is study. The study can be one or two days a week or in blocks such as a week at a time, depending on the university and the employer. The employer pays you throughout, and an end-point assessment at the end checks you can do the job, alongside assignments during the course.",
        ],
      },
      {
        heading: "What you finish with",
        bullets: [
          "A Level 6 degree apprenticeship is equal to a bachelor's degree, and a Level 7 is equal to a master's, according to GOV.UK.",
          "Many also include professional qualifications. For example, a chartered surveyor route we read leads to a RICS-accredited degree, and UBS's investment bank route includes CFA Level 1 or a Chartered Banker Institute qualification.",
          "The length depends on the level: UCAS says three to six years.",
        ],
      },
      {
        heading: "Who can apply",
        bullets: [
          "GOV.UK says you must be 16 or over, living in England and not in full-time education. A previous qualification, even a degree, does not stop you starting an apprenticeship.",
          "Each employer sets its own entry requirements, so see our guide to the grades and other rules real vacancies ask for.",
          "Scotland calls its version graduate apprenticeships. UCAS says Wales offers degree apprenticeships too, and Northern Ireland has higher level apprenticeships, mostly at Level 5.",
        ],
      },
      {
        heading: "Where to find them",
        paragraphs: [
          "Search the GOV.UK Find an apprenticeship service, UCAS's apprenticeship search and employers' own careers pages. Our deadlines page lists which employers are open now and when each closes, and our employer pages say plainly which employers offer a degree apprenticeship and which offer a different level.",
        ],
      },
    ],
    cta: { href: "/guide", label: "Walk through each stage", blurb: "What happens at every stage of a typical application, and how to prepare." },
    related: ["apprenticeship-levels-explained", "degree-apprenticeship-vs-university", "degree-apprenticeship-entry-requirements", "how-to-apply-for-a-degree-apprenticeship"],
    updated: "2026-11-20",
    sources: [
      { label: "UCAS: degree apprenticeships", url: "https://www.ucas.com/apprenticeships/degree-apprenticeships" },
      { label: "GOV.UK: apprenticeship qualifications and levels", url: "https://www.gov.uk/apprenticeships-guide/qualifications-and-levels" },
      { label: "GOV.UK: apprenticeships guide", url: "https://www.gov.uk/apprenticeships-guide" },
    ],
  },
  {
    slug: "degree-apprenticeship-personal-statement",
    title: "How to write a degree apprenticeship personal statement",
    seoTitle: "How to write a degree apprenticeship statement",
    description: "A step-by-step way to write an application statement or motivation answer: what to include, a simple structure, common mistakes and an example.",
    intro:
      "Many applications ask you to explain why you want the role, why this employer and what you can offer. The best answers are specific, honest and short. Here is a structure that works for most of them.",
    sections: [
      {
        heading: "Start with what they ask",
        paragraphs: [
          "Read the question and any word limit twice. Answer exactly that question, and keep to the limit. If there is no question, write about why this role, why this employer and what you will bring.",
        ],
      },
      {
        heading: "A simple structure",
        bullets: [
          "Why this career: one or two sentences about what draws you to it, based on something you have actually done or seen.",
          "Why this employer: one thing specific to them, such as a programme, a product or a value, that shows you have researched it.",
          "Evidence you can do it: two short examples from school, work, clubs or projects, showing a skill and the result.",
          "What you want next: a closing line about what you want to learn and contribute.",
        ],
      },
      {
        heading: "Make it specific",
        paragraphs: [
          "Replace general claims with evidence. Instead of \"I am a good team player\", describe the team, what you did and what happened. Numbers help: the size of a team, the amount raised, the grade improved.",
        ],
      },
      {
        heading: "Mistakes to avoid",
        bullets: [
          "Opening lines like \"Since I was young I have always wanted to...\". Start with something real instead.",
          "Listing activities without saying what you learned from them.",
          "Copying text from the employer's website or from another statement.",
          "Using AI to write the whole thing. Some employers ban AI help in applications, and the person who reads yours wants to hear you. Check the employer's rules, then write it yourself and use feedback to improve it.",
          "Skipping the proofread. Read it aloud and ask someone else to check it.",
        ],
      },
      {
        heading: "Before you submit",
        paragraphs: [
          "Check the word count, the question, the employer's name and the spelling of everything. Then get feedback and fix the weakest sentence.",
        ],
      },
      {
        heading: "Turn what you have done into evidence",
        paragraphs: [
          "Employers read dozens of statements that say \"I am hard-working and a good team player\". What stands out is a specific thing you did, what it needed from you and what happened. A simple pattern for each paragraph is: what you did, the skill it shows, and the result.",
          "For example (a pattern, not a line to copy): \"I organised the rota for our school's charity fun run with six volunteers. Keeping it fair when two people dropped out showed me how to plan around problems, and we raised more than the year before.\" Swap in your own facts and numbers, and only include what is true.",
        ],
      },
      {
        heading: "Edit it in one hour",
        bullets: [
          "10 minutes: read it aloud and cross out every sentence that could be written by anyone.",
          "15 minutes: for each skill you claim, add one specific example, or delete the claim.",
          "10 minutes: check the opening and the ending. Start with your motivation, not your life story, and end on what you will bring and learn.",
          "10 minutes: match it to the advert. Use the employer's own words for the skills it asks for, where they are true of you.",
          "15 minutes: proofread, then ask someone else to read it. Spelling slips look careless in a job application.",
        ],
      },
      {
        heading: "Mistakes that cost you",
        bullets: [
          "Copying a model statement. Employers recognise them, and they say nothing about you.",
          "Listing activities without saying what you did or learned from them.",
          "Using the same statement for every employer. A short, specific line about why this employer matters more than a long general one.",
          "Exaggerating. Interviewers ask follow-up questions about anything you wrote, so be ready to talk about every line.",
        ],
      },
    ],
    cta: { href: "/review", label: "Get feedback out of 100", blurb: "Paste or upload your statement and see what to fix, with a stronger version of weak lines." },
    related: ["how-to-answer-why-this-company", "what-is-a-degree-apprenticeship", "how-to-apply-for-a-degree-apprenticeship"],
    updated: "2026-11-20",
  },
  {
    slug: "degree-apprenticeship-interview-questions",
    title: "Degree apprenticeship interview questions and how to answer them",
    seoTitle: "Degree apprenticeship interview questions and answers",
    description: "The question types you will meet in video interviews and final interviews, a method for answering, and example questions to practise.",
    intro:
      "Employers rarely have a secret list of questions. They ask the same few kinds of question in different words: why this role, tell me about a time, and how would you handle this. Practise the kinds and you can answer any version.",
    sections: [
      {
        heading: "The main question types",
        bullets: [
          "Motivation: why this employer, why this role, why an apprenticeship rather than university.",
          "Behavioural: tell me about a time you worked in a team, solved a problem, handled pressure or learned from a mistake.",
          "Situational: what would you do if... a deadline was at risk, a colleague disagreed, you made an error.",
          "Commercial awareness: what is happening in this industry, and why might it matter to the employer?",
        ],
      },
      {
        heading: "Use STAR for behavioural questions",
        paragraphs: [
          "Situation (one sentence), Task (what you needed to do), Action (what you did, not what the team did), Result (what happened and what you learned). Spend most of the time on action and result. Have six to eight real stories ready: teamwork, problem solving, resilience, initiative, leadership and a mistake you learned from. One story can answer several questions.",
        ],
      },
      {
        heading: "Example questions to practise",
        bullets: [
          "Why do you want to do an apprenticeship with us rather than go to university? (example)",
          "Tell me about a time you had to work with someone you found difficult. (example)",
          "Describe a time you had a lot to do and not much time. How did you decide what to do first? (example)",
          "What is one thing happening in our industry right now, and why does it matter? (example)",
        ],
      },
      {
        heading: "For recorded video interviews",
        bullets: [
          "Look at the camera lens, not the screen.",
          "Answer out loud with a timer when you practise. Most timed answers are one to three minutes.",
          "Do not read from a script. Use two or three key words as prompts.",
          "Test your camera, sound, lighting and connection first, and have a backup plan for technical problems.",
        ],
      },
      {
        heading: "The four kinds of question",
        bullets: [
          "Motivation: why this employer, why an apprenticeship, why this area. Reported often, including \"why an apprenticeship rather than a traditional degree?\".",
          "Competency: tell me about a time you worked in a team, handled a deadline or dealt with something that went wrong.",
          "Strengths-based: what do you enjoy, and what are you good at? Some employers, including Forvis Mazars, use a strengths-based interview, where honest and energetic answers matter.",
          "Situational: what would you do if... A short, practical answer that shows your reasoning does better than a perfect one.",
        ],
      },
      {
        heading: "A worked STAR answer (a pattern)",
        paragraphs: [
          "Question: tell me about a time something did not go to plan. Situation: \"Our school enterprise stall had its main supplier cancel two days before the sale.\" Task: \"As the person in charge of stock, I needed enough product to keep the stall open.\" Action: \"I phoned three other suppliers, compared prices and delivery times, and chose the one that could deliver by Friday, then told the team the plan.\" Result: \"We opened on time and sold out, and I learned to keep a backup option for anything important.\" This is an example of the shape; use your own true story.",
        ],
      },
      {
        heading: "Build a bank of five stories",
        bullets: [
          "Choose five experiences from school, work, sport, volunteering or home that you can describe in detail.",
          "Write each as situation, task, action, result in four short lines.",
          "Tag each with the skills it shows, such as teamwork, resilience, organisation, initiative and leadership. One story can answer several questions.",
          "Say them out loud against a timer. A clear answer usually takes one to two minutes.",
        ],
      },
      {
        heading: "On the day",
        bullets: [
          "It is fine to pause and think before you answer. A calm, structured answer beats a rushed one.",
          "If you do not understand a question, ask for it to be repeated or rephrased.",
          "Ask one or two real questions at the end, based on your research about the programme.",
        ],
      },
    ],
    cta: { href: "/interview", label: "Practise an interview", blurb: "Answer out loud or in text and get a mark out of 100 with a stronger version of each answer." },
    related: ["video-interview-tips-hirevue", "how-to-answer-why-this-company", "assessment-centre-tips"],
    updated: "2026-11-20",
  },
  {
    slug: "numerical-verbal-reasoning-tests",
    title: "Numerical and verbal reasoning tests: how to prepare",
    seoTitle: "Numerical and verbal reasoning tests: how to prepare",
    description: "What employer aptitude tests look like, how they are scored in general, and practical ways to improve your speed and accuracy.",
    intro:
      "Many degree apprenticeship applications include an online test soon after you apply. They are timed and are often used to decide who goes through, so a little practice goes a long way.",
    sections: [
      {
        heading: "The usual types",
        bullets: [
          "Numerical reasoning: read tables and charts and work out percentages, ratios, averages and changes.",
          "Verbal reasoning: read a short passage and decide whether statements are true, false or cannot be said.",
          "Logical or inductive reasoning: spot the pattern in a sequence of shapes.",
          "Situational judgement: choose the best and worst response to a work scenario.",
          "Game-style tasks: short puzzles that measure how you decide, adapt and persist.",
        ],
      },
      {
        heading: "How to improve",
        bullets: [
          "Practise under time pressure. Speed is usually the hard part, not the maths.",
          "Revise percentages, fractions, ratios and averages, and practise doing them quickly with a calculator if one is allowed.",
          "For verbal tests, answer only from the passage. \"Cannot say\" is a real answer when the passage does not state it.",
          "If a question is taking too long, make your best guess and move on. Check whether wrong answers lose marks.",
          "Read the instructions fully before you begin, including whether you can go back.",
        ],
      },
      {
        heading: "On the day",
        bullets: [
          "Use a quiet place, a reliable connection and a laptop if you can, with paper, a pen and a calculator if allowed.",
          "Do it in one sitting when you are alert, not late at night.",
          "Answer honestly in personality and situational questions. They are checked for consistency.",
        ],
      },
      {
        heading: "Rules about outside help",
        paragraphs: [
          "Some employers say you must not use AI or other help during online tests, video interviews and assessment centres. Using it can end your application, so read the instructions and do the tests yourself.",
        ],
      },
      {
        heading: "What the questions look like",
        bullets: [
          "Verbal reasoning: you read a short passage and decide whether a statement is true, false or cannot be said from the passage alone. Answer only from the passage, not from what you know.",
          "Numerical reasoning: you read tables and charts and work out percentages, ratios and changes over time. Practise reading the question first so you know what to look for.",
          "Inductive or logical reasoning: you find the pattern in a sequence of shapes. UBS, for example, lists inductive-logical tests among the four it assigns by business area.",
          "Situational judgement: you choose or rate responses to a work scenario. See our guide to the Civil Service judgement test for how one official version works.",
        ],
      },
      {
        heading: "How tight is the timing?",
        paragraphs: [
          "Timing varies by test and employer, so check your invitation. As an example of the pressure, the Civil Service Fast Track tests, which have since closed, gave a guide time of six minutes for 36 verbal questions and six minutes for 24 numerical ones. That is a speed test, and it is why practising under a timer matters more than doing untimed questions.",
        ],
      },
      {
        heading: "A four-week practice plan (advice)",
        bullets: [
          "Week 1: one untimed test of each type, reading every explanation to find the question types you miss.",
          "Week 2: timed sets of 10 questions in your weaker type, aiming for accuracy first.",
          "Week 3: full timed tests, and review only the mistakes.",
          "Week 4: two or three timed tests under realistic conditions, on the device you will use, then rest the day before.",
        ],
      },
      {
        heading: "Tests versus games",
        paragraphs: [
          "Some employers use game-based assessments instead of, or as well as, these tests. Games usually measure traits or attention and memory rather than right and wrong answers, so the preparation is different. See our guides to the providers employers name, such as Arctic Shores, Pymetrics, HireVue games, Aon and Neurosight, and what each says about preparation.",
        ],
      },
    ],
    cta: { href: "/practice", label: "Practise employer-style tests", blurb: "Timed numerical, verbal, logical and situational practice with explanations." },
    related: ["civil-service-judgement-test", "degree-apprenticeship-interview-questions", "assessment-centre-tips"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: Civil Service Fast Track Apprenticeship, how to apply (withdrawn 27 November 2020)", url: "https://www.gov.uk/guidance/civil-service-fast-track-apprenticeship-how-to-apply" },
      { label: "UBS: apprenticeships (UK)", url: "https://www.ubs.com/global/en/careers/apprenticeships/gbr.html" },
    ],
  },
  {
    slug: "how-to-answer-why-this-company",
    title: "How to answer \"Why this company?\" in an apprenticeship application",
    seoTitle: "How to answer \"Why this company?\" with examples",
    description: "A simple method to research an employer in 20 minutes and write a specific, convincing answer to why you want to work there.",
    intro:
      "\"Why us?\" is the question employers ask most, and the one most people answer with something that could be about any company. A specific answer sets you apart, and you can build one in about twenty minutes.",
    sections: [
      {
        heading: "Research in four places",
        bullets: [
          "The employer's early-careers page: the programme names, what apprentices do and what they say about it.",
          "Its values or principles, usually on the careers or About page.",
          "Recent news: a new project, product, office or announcement.",
          "Apprentice stories or social media from people already on the programme.",
        ],
      },
      {
        heading: "A three-part answer",
        bullets: [
          "Something specific about them: a programme, a value or a project, in your own words.",
          "Why it matches you: link it to something you have done or care about.",
          "What you will bring and learn: end on the future, not on flattery.",
        ],
      },
      {
        heading: "An example of the structure (example)",
        paragraphs: [
          "\"I like that your apprentices rotate through different teams in the first year, because I want to see how the whole business works before I specialise. At school I ran the finance side of our enterprise project, which showed me I enjoy working with numbers and people at the same time. I would like to bring that curiosity and learn how a firm of your size manages risk.\" Swap in your own facts: this is only a pattern, so do not copy it.",
        ],
      },
      {
        heading: "What to avoid",
        bullets: [
          "Saying you want to work somewhere \"prestigious\" or \"well known\".",
          "Repeating a slogan from the website.",
          "Using the same answer for every employer. They can tell.",
          "Talking only about what you will get. Add what you will give.",
        ],
      },
      {
        heading: "Three lengths of the same answer",
        bullets: [
          "Fifty words, for a form box or a short question: one specific fact about the employer, one reason it matches you, one line on what you will bring.",
          "One hundred and fifty words, for a motivation question: add a short example from your own experience that connects to the employer's work.",
          "Two minutes, for an interview or video question: the three parts in full, with the example told as a mini story and a clear ending about what you want to learn.",
        ],
      },
      {
        heading: "Where to find the specifics fast",
        bullets: [
          "The employer's programme page for what apprentices do and how the programme is structured.",
          "Its values or principles page, then pick one value that genuinely matches something you have done.",
          "Our employer pages, which list the programmes, the entry requirements and for many the values employers assess against.",
          "A recent news story, but only if you can explain why it matters to apprentices or customers.",
        ],
      },
      {
        heading: "Check before you submit",
        bullets: [
          "Could this answer be sent to a different employer by changing the name? If so, add something only true of this one.",
          "Is every claim about the employer one you could explain if asked?",
          "Have you said what you will give, not only what you will get?",
        ],
      },
    ],
    cta: { href: "/employers", label: "Research an employer", blurb: "Employer guides with the process, values and programmes in one place." },
    related: ["degree-apprenticeship-personal-statement", "degree-apprenticeship-interview-questions", "video-interview-tips-hirevue"],
    updated: "2026-11-20",
  },
  {
    slug: "assessment-centre-tips",
    title: "Assessment centre tips for degree apprenticeships",
    seoTitle: "Degree apprenticeship assessment centre tips",
    description: "What happens at an assessment centre, how to handle group exercises, presentations and case studies, and how to manage nerves.",
    intro:
      "An assessment centre is usually the stage before the final decision. It can be online or in person, and it mixes several exercises so the employer sees how you work, not just how you talk. Here is what to expect and how to prepare.",
    sections: [
      {
        heading: "What it can include",
        bullets: [
          "A group exercise: you and other candidates discuss a scenario and reach a recommendation.",
          "A presentation: sometimes on a topic you are given beforehand.",
          "A case study or written task about a business problem.",
          "An interview with a manager or partner.",
          "Lunch or a chat with current apprentices, which is part of the assessment too.",
        ],
      },
      {
        heading: "Group exercises",
        bullets: [
          "Contribute early with a clear point, then listen and build on others' ideas.",
          "Help the group finish on time and reach a recommendation. Watch the clock.",
          "Bring quiet people in. Employers value that more than talking the most.",
          "You do not need to win the argument. You need to show you can work well with others.",
        ],
      },
      {
        heading: "Presentations and case studies",
        bullets: [
          "Pick one clear message and two or three points that support it.",
          "Rehearse to the time limit out loud, and leave room for questions.",
          "State your assumptions. In a case study, show how you reached your answer, not only the answer.",
        ],
      },
      {
        heading: "The day itself",
        bullets: [
          "Check the format, location, time and what to bring a few days ahead. For online centres, test your device and connection.",
          "Be polite and professional with everyone you meet, from reception onwards.",
          "Sleep, eat and arrive early. Nerves are normal and the assessors expect them.",
        ],
      },
      {
        heading: "What assessors are looking for",
        paragraphs: [
          "You are usually scored against a set of behaviours, not against the other candidates. In a group task that means contributing ideas, listening, including quieter people and helping the group reach a decision, not winning the argument. In a written or case task it means a clear structure and a reasoned recommendation.",
        ],
      },
      {
        heading: "Group exercises",
        bullets: [
          "Speak early, with a useful point, so you are part of the discussion from the start.",
          "Refer to what others said (\"building on Priya's point...\") and invite quieter members in.",
          "Watch the time. Suggest a plan for the time you have and keep to it, and make sure a decision is reached.",
          "Do not interrupt, dominate or stay silent. Both extremes score badly.",
        ],
      },
      {
        heading: "Written, case study and in-tray tasks",
        bullets: [
          "Read the brief twice and underline what you are being asked for before you write anything.",
          "State your recommendation first, then give two or three reasons, then name a risk. Short, structured writing is easier to mark.",
          "In an in-tray task, sort by urgency and importance and say briefly why. Mark what you would delegate or leave.",
          "Use the time given. Leave two minutes to check for mistakes.",
        ],
      },
      {
        heading: "The day before and the day itself",
        bullets: [
          "Re-read the invitation for the schedule, location or link, and what to bring. Employers often ask for ID and certificates.",
          "For an online centre, test your camera, microphone and connection and set up a quiet space.",
          "Re-read your application and your notes on the employer so your answers match what you wrote.",
          "Arrive or log in early. Treat everyone you meet, including reception and other candidates, politely, because assessors are often asked for their view.",
        ],
      },
    ],
    cta: { href: "/employers", label: "Practise a mock process", blurb: "Employer-style stages in order: tests, video interview, case study and final interview." },
    related: ["video-interview-tips-hirevue", "degree-apprenticeship-interview-questions", "numerical-verbal-reasoning-tests"],
    updated: "2026-11-20",
  },
  {
    slug: "civil-service-judgement-test",
    title: "The Civil Service judgement test: what it is and how to prepare",
    seoTitle: "Civil Service judgement test: what it is and how to prepare",
    description:
      "How the Civil Service judgement test works: two parts, no time limit, how it is scored, whether there is a pass mark, retakes and how to prepare, from the official GOV.UK guidance.",
    intro:
      "If a Civil Service Jobs application asks you to take the judgement test, it is a situational judgement test on workplace scenarios, and it is not timed. This guide sets out what the official guidance says, and says plainly where something is not published.",
    sections: [
      {
        heading: "What the test is",
        paragraphs: [
          "GOV.UK describes it as an online situational judgement test that measures your judgement against the Civil Service Behaviours. It has two parts.",
        ],
        bullets: [
          "Part 1 is a self-assessment of how you typically work and what you prefer, such as how ambitious, motivated and flexible you are. It counts for 15% of the overall score, and the guidance warns that your answers may be discussed at interview.",
          "Part 2 shows workplace scenarios. For each scenario there are several possible actions, and you rate how effective each action is on a four-point scale: counterproductive, ineffective, fairly effective or effective.",
        ],
      },
      {
        heading: "How the scenarios work",
        bullets: [
          "There are three scenarios for each behaviour, and four actions to rate in each scenario.",
          "You rate each action on its own, so more than one action can get the same rating.",
          "Some scenarios are videos (with subtitles, BSL and transcripts) and some are text. Which you see depends on the job.",
          "You only see scenarios that match the level of the job you applied for.",
        ],
      },
      {
        heading: "Timing: allow an hour",
        paragraphs: [
          "The test is not timed. GOV.UK says most people spend two to four minutes on each scenario and recommends allowing at least an hour, in a quiet place with a stable internet connection. Do not start it ten minutes before you need to leave.",
        ],
      },
      {
        heading: "Scoring, pass marks and feedback",
        bullets: [
          "Your score is based on the number and difficulty of the questions and is shown as a percentile against a representative group.",
          "You get your score and automatically generated feedback in your Civil Service Jobs application centre. Feedback on individual questions is not given, for security reasons.",
          "Reaching the minimum for the job's level triggers a message. After the deadline the recruiter can set a higher pass mark, and meeting the minimum does not guarantee you are invited to the next stage.",
          "The exact pass mark is not published, and how Part 1 and Part 2 combine beyond the 15% figure is not stated.",
        ],
      },
      {
        heading: "Retakes",
        paragraphs: [
          "If you do not reach the minimum, you can take the test again in a future application. A hiring manager can also ask for a supervised retake if you are invited to interview, and you are told if that applies to you.",
        ],
      },
      {
        heading: "How to prepare",
        bullets: [
          "Use the official practice test linked from the GOV.UK guidance. It is not scored and needs no specialist knowledge.",
          "Read the Civil Service Behaviours for the level you are applying for, so you know what good judgement looks like in this context.",
          "For each action, ask what would genuinely help the team and the public, within the rules, rather than what sounds cautious or bold.",
          "Answer every question, read the instructions, and use a larger screen if you can. The test works on most modern browsers, and phones and tablets should work.",
          "If you need adjustments or have a technical problem, tell the recruitment team at least two working days before the deadline, using the contact in the job advert.",
        ],
      },
      {
        heading: "Do not confuse it with the old Fast Track tests",
        paragraphs: [
          "The Civil Service Fast Track Apprenticeship is closed: its guidance was withdrawn on 27 November 2020. Its old process used verbal and numerical reasoning tests, a situational judgement questionnaire that asked you to pick the most and least effective option from four, and a competency questionnaire. Some prep sites still describe that process as current. Today, Civil Service apprenticeships are advertised by individual departments, so read the advert for which tests and stages that campaign uses.",
        ],
      },
    ],
    cta: { href: "/employers/civil-service-fast-track", label: "Civil Service guide", blurb: "The closed Fast Track process and what current Civil Service apprenticeship applications involve." },
    related: ["numerical-verbal-reasoning-tests", "assessment-centre-tips", "degree-apprenticeship-interview-questions"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: Preparing for the Civil Service judgement test (updated 24 May 2024)", url: "https://www.gov.uk/guidance/preparing-for-the-civil-service-judgement-test" },
      { label: "GOV.UK: Civil Service Fast Track Apprenticeship, how to apply (withdrawn 27 November 2020)", url: "https://www.gov.uk/guidance/civil-service-fast-track-apprenticeship-how-to-apply" },
    ],
  },
  {
    slug: "when-do-degree-apprenticeships-open",
    title: "When do degree apprenticeships open and close? The 2027 intake",
    seoTitle: "When do degree apprenticeships open? 2027 intake dates",
    description:
      "There is no single date. How degree apprenticeship windows work for the 2027 intake, which employers have said what, why rolling applications close early, and how to track the dates.",
    intro:
      "There is no single date when degree apprenticeships open. Each employer sets its own window, many fill places as applications arrive, and several have not published their 2027 dates yet. Here is how it works and how to avoid missing yours.",
    sections: [
      {
        heading: "The short answer",
        paragraphs: [
          "Most large employers open for the next September intake some time between late summer and early spring, and the window can be a few weeks or most of the year. Because many review applications as they arrive, a scheme can close well before its stated end date once it has enough applicants. The safe habit is to apply early in the window, not near the end.",
        ],
      },
      {
        heading: "What employers have actually said",
        bullets: [
          "BAE Systems says on its careers pages that it reopens for 2027 opportunities in January, with its main recruitment window starting at the beginning of January and running for about six weeks.",
          "The Financial Conduct Authority ran its 2026 scheme from March to 19 April 2026, with apprentices starting on 7 September 2026. That shows a spring window exists for some employers, but check its page for 2027 dates.",
          "A university apprenticeships page says firms typically open their degree apprenticeship applications for the autumn start between September and March.",
          "A prep-site tracker still lists the 2027 deadlines of several large professional services firms as to be confirmed, so do not assume last year's dates repeat.",
        ],
      },
      {
        heading: "Rolling applications close early",
        paragraphs: [
          "Where an employer reviews applications in the order they arrive, the closing date is a maximum, not a promise. Reports advise applying early for employers such as BAE Systems because roles can close once enough applications are in. When our tracker shows an employer as rolling, treat it as closing when full.",
        ],
      },
      {
        heading: "What to do now",
        bullets: [
          "Pick a shortlist of employers and check each one's own page for the 2027 window.",
          "Add them to a tracker with their dates, and set up deadline emails so you are told when each opens and a week before it closes.",
          "Have your personal statement and CV drafted before applications open, so you can apply in the first days.",
          "Practise the online tests and video interview that stage of the process uses, because many employers screen before you ever speak to a person.",
        ],
      },
      {
        heading: "Where to see the dates",
        paragraphs: [
          "Our deadlines page lists every employer we have a confirmed date for, soonest closing date first, with when each date was last checked on the employer's own page. Employers that have not published dates are marked as not confirmed rather than guessed.",
        ],
      },
    ],
    cta: { href: "/deadlines", label: "See who is open now", blurb: "Closing dates for the 2027 intake, soonest first, with the date each was last checked." },
    related: ["degree-apprenticeship-personal-statement", "how-to-answer-why-this-company"],
    updated: "2026-11-20",
    sources: [
      { label: "BAE Systems: degree apprenticeships", url: "https://www.baesystems.com/careers/locations/uk/apprentices/degree.html" },
      { label: "Financial Conduct Authority: apprenticeships", url: "https://www.fca.org.uk/apprenticeships" },
      { label: "Loughborough University: how can I find an apprenticeship?", url: "https://lboro.ac.uk/degree-apprenticeships/apprentices/find-apprenticeship/" },
      { label: "Intervyo: 2027 consulting and accountancy tracker (third party)", url: "https://www.intervyo.co.uk/tracker/consulting-degree-apprenticeship" },
    ],
  },
  {
    slug: "degree-apprenticeship-salary",
    title: "How much do degree apprentices get paid? Real 2027 salaries",
    seoTitle: "Degree apprenticeship salary: what you get paid in 2027",
    description:
      "What degree apprentices are paid: the legal minimum wage, real salaries from 2027 vacancies, paid study time and holiday, and what to check in an advert.",
    intro:
      "A degree apprentice is paid a wage by their employer, never less than the apprentice minimum wage, which is £8 an hour in the first year on the April 2026 rates. The vacancies we read in November 2026 advertised between about £16,640 and £26,000 a year, and in the vacancies we read the degree is described as funded, with no tuition fees for the apprentice.",
    sections: [
      {
        heading: "The legal minimum",
        bullets: [
          "The apprentice rate is £8 an hour on the April 2026 rates. It applies to apprentices under 19, and to apprentices aged 19 or over in the first year of their apprenticeship. GOV.UK shows it rising to £8.31 from April 2027.",
          "After the first year, apprentices aged 19 or over get the minimum wage for their age. GOV.UK's example is a 21-year-old, who gets £12.71 an hour once they have completed year one.",
          "At £8 an hour for a 40-hour week, the minimum comes to £16,640 a year. That is exactly the bottom of one employer's advertised range below.",
          "The rates change every 1 April, so check the GOV.UK minimum wage page for the current figure.",
        ],
      },
      {
        heading: "What employers actually advertised",
        paragraphs: ["These are the pay figures stated on vacancy pages for 2027 starts, read on 20 November 2026. Several employers state only that pay is competitive, and we have left those out of the figures."],
        bullets: [
          "Cranswick, Food Manufacturing Operations (Level 6): £16,640 to £26,436.80 depending on your age, described as above the minimum wage and reviewed annually.",
          "Unilever, Packaging Professional (Level 6): £18,841.",
          "Ridge, Elevate degree apprenticeship: £19,000 to £23,000, on a permanent contract.",
          "Dalcour Maclaren, Chartered Surveyor (Rural, Level 6): £19,500, with a fuller package discussed at interview.",
          "Molson Coors, Supply Chain (Level 6): £23,500 plus a 5.5% target annual bonus.",
          "Cavendish Nuclear, Chemical and Process Engineer (Level 6): £23,598.",
          "Thales, Systems Engineering (Level 6): £24,000, with a pension match and performance-related uplifts.",
          "Hanson, Quantity Surveyor (Level 6): £25,084.",
          "Trowers & Hamlins, Solicitor (Level 7): £26,000, reviewed annually.",
          "Stantec, TLT, Neptune North and AWE state a competitive salary without a figure.",
        ],
      },
      {
        heading: "Why the numbers differ",
        paragraphs: [
          "Pay depends on the sector, the region, your age and the length of the programme. A two-year supply chain route and a six-year solicitor route are not like for like, and an advert with an age-based range (like Cranswick's) pays the youngest apprentices the lowest figure. Compare the total package, not only the salary.",
        ],
      },
      {
        heading: "Paid study time and holiday",
        bullets: [
          "GOV.UK says apprentices must spend at least 20% of their normal working hours on training, and that this training time is paid.",
          "Apprentices get at least 20 days of paid holiday a year, plus bank holidays.",
          "Employers add their own benefits. Examples in the vacancies we read include a pension match, private medical insurance, a season ticket loan, an employee share scheme, five weeks' leave and 28 to 31 days' holiday (28 of them including bank holidays at one employer).",
        ],
      },
      {
        heading: "What to check in an advert",
        bullets: [
          "Whether a salary figure is stated, or only that it is competitive. Ask at the application stage if it is missing.",
          "Whether the figure depends on your age, and whether it rises after the first year.",
          "Whether there is a bonus, a pension match or other benefits you would otherwise pay for.",
          "Whether the degree is funded by the employer, so you pay no tuition fees. Every vacancy we read that mentioned this said so, but check each advert.",
          "Where the job is based, because commuting or moving costs come out of your pay.",
        ],
      },
    ],
    cta: { href: "/deadlines", label: "See who is open now", blurb: "Closing dates for the 2027 intake, soonest first, with the date each was last checked." },
    related: ["degree-apprenticeship-vs-university", "what-is-a-degree-apprenticeship", "when-do-degree-apprenticeships-open"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: National Minimum Wage and National Living Wage rates", url: "https://www.gov.uk/national-minimum-wage-rates" },
      { label: "GOV.UK: apprentice pay and conditions", url: "https://www.gov.uk/become-apprentice/pay-and-conditions" },
      { label: "UCAS: degree apprenticeships", url: "https://www.ucas.com/apprenticeships/degree-apprenticeships" },
      { label: "Cranswick vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000051163" },
      { label: "Unilever packaging apprenticeship", url: "https://careers.unilever.com/en/uk-and-ireland-early-careers-apprenticeships-packaging-professional-level-6" },
      { label: "Ridge: Elevate and Evolve", url: "https://ridge.co.uk/?p=12314" },
      { label: "Dalcour Maclaren vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000056571" },
      { label: "Molson Coors vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000059137" },
      { label: "Cavendish Nuclear vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058692" },
      { label: "Thales vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057141" },
      { label: "Hanson vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057225" },
      { label: "Trowers & Hamlins vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000055810" },
    ],
  },
  {
    slug: "degree-apprenticeship-entry-requirements",
    title: "What grades do you need for a degree apprenticeship?",
    seoTitle: "Degree apprenticeship entry requirements: grades and more",
    description:
      "Entry requirements for degree apprenticeships are set by each employer. Real GCSE, A-level and UCAS points examples from 2027 vacancies, plus the non-grade rules to check.",
    intro:
      "There is no single entry requirement for degree apprenticeships: each employer sets its own, and UCAS says each vacancy will be different. The 2027 vacancies we read asked for anything from GCSE English and Maths at grade 4 to three A-levels at BBC or ABB, and some added non-grade rules such as security clearance.",
    sections: [
      {
        heading: "What the official sources say",
        bullets: [
          "GOV.UK says you must be 16 or over, living in England, and not in full-time education to start an apprenticeship. The Find an apprenticeship page words the last condition more strictly, so check the vacancy.",
          "UCAS says each degree apprenticeship vacancy is different: some ask for specific grades, and employers also look for skills such as communication and leadership. The page gives no UCAS Tariff minimum.",
          "A previous qualification, such as a degree, does not stop you starting an apprenticeship, according to GOV.UK.",
        ],
      },
      {
        heading: "Real examples from 2027 vacancies",
        paragraphs: ["Read on 20 November 2026 from each employer's vacancy page. Subjects and grades are as the page states them."],
        bullets: [
          "Molson Coors (Level 6, supply chain): GCSE English and Maths at grade 4, and you must be over 18.",
          "Cranswick (Level 6, food manufacturing): GCSE English and Maths at grade 4 or above, and an A-level in any subject at grade C or above.",
          "Unilever (Level 6, packaging): five GCSEs including English Language and Maths at grade 4 or above, and three A-levels at BBC or above including two STEM subjects, held or predicted.",
          "Thales (Level 6, systems engineering): five GCSEs including Maths and English, and A-levels in Maths and another STEM subject at BB or above (112 UCAS points).",
          "Hanson (Level 6, quantity surveying): five GCSEs including Maths, English and Science at grade C or above, and two A-levels including a STEM subject (112 or more UCAS points).",
          "Stantec (Level 6, civil engineering): GCSE Maths and English at grade 5 or 6 or above, and A-levels at BBC including Maths and an analytical science. A BTEC route needs Maths at Merit or above.",
          "Cavendish Nuclear (Level 6, chemical and process engineering): GCSEs at grade C including Chemistry, English, Maths and Science, and A-levels in Chemistry and Maths at A or B.",
          "TLT (Level 7, solicitor): 128 UCAS points, which the page gives as ABB.",
          "Trowers & Hamlins (Level 7, solicitor): GCSE English and Maths at grade 6 or B, and three A-levels in any subjects at grades A, B and B.",
          "Neptune North (degree, digital and technology): very strong GCSEs and a minimum of AAA or AAB predicted, with Maths as one of the A-levels.",
          "Visa: no technical subjects required at school or college, with the process focusing on behaviours and problem solving.",
        ],
      },
      {
        heading: "The rules that are not grades",
        bullets: [
          "Security clearance: some defence and nuclear employers require you to be able to obtain and keep BPSS and SC clearance. Thales says SC typically needs continuous UK residence for the last five years, and Leonardo says five years' permanent residency.",
          "Right to work: several employers, including Visa, cannot sponsor you if you do not already have the right to work in the UK.",
          "A driving licence and your own car, as one rural surveying employer requires.",
          "Age: one employer asks that you are over 18 for health and safety reasons.",
          "Willingness to relocate or travel, as one quantity surveying employer states.",
        ],
      },
      {
        heading: "If you are close but not quite there",
        paragraphs: [
          "Several employers say other relevant qualifications and experience can be shared and the apprenticeship adjusted. Some accept equivalents, such as a BTEC in place of A-levels, as one engineering employer does. Some employers accept predicted grades at the application stage, as Unilever and Neptune North do, with an offer conditional on your results. If a requirement is unclear, ask the employer before you apply, because a short reply can save you an application.",
        ],
      },
      {
        heading: "How to use this",
        bullets: [
          "Pick the sector first, then read two or three adverts to see the realistic range for the grades they ask.",
          "Check the subjects as well as the grades: STEM employers often name Maths and another science.",
          "Apply to several. UCAS says you are free to apply for multiple degree apprenticeships and traditional university courses at the same time.",
        ],
      },
    ],
    cta: { href: "/sectors", label: "Browse employers by sector", blurb: "Every tracked employer by sector, with the level of its programme and whether it is open." },
    related: ["what-is-a-degree-apprenticeship", "degree-apprenticeship-vs-university", "degree-apprenticeship-personal-statement"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: apprenticeships guide", url: "https://www.gov.uk/apprenticeships-guide" },
      { label: "GOV.UK: find an apprenticeship", url: "https://www.gov.uk/apply-apprenticeship" },
      { label: "UCAS: degree apprenticeships", url: "https://www.ucas.com/apprenticeships/degree-apprenticeships" },
      { label: "Molson Coors vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000059137" },
      { label: "Cranswick vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000051163" },
      { label: "Unilever packaging apprenticeship", url: "https://careers.unilever.com/en/uk-and-ireland-early-careers-apprenticeships-packaging-professional-level-6" },
      { label: "Thales vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057141" },
      { label: "Hanson vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000057225" },
      { label: "Stantec vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058198" },
      { label: "Cavendish Nuclear vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000058692" },
      { label: "TLT vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000056706" },
      { label: "Trowers & Hamlins vacancy (Find an Apprenticeship)", url: "https://www.findapprenticeship.service.gov.uk/apprenticeship/reference/2000055810" },
      { label: "Neptune North vacancy", url: "https://job-boards.eu.greenhouse.io/neptunenorth/jobs/4910464101" },
      { label: "Visa: apprenticeship application process", url: "https://uk.review.visa.com/careers/next-gen-careers/application-process-apprenticeship.html" },
      { label: "Leonardo apprenticeship opportunities", url: "https://careers.uk.leonardo.com/gb/en/early-careers/apprenticeships/opportunities" },
    ],
  },
  {
    slug: "apprenticeship-levels-explained",
    title: "Apprenticeship levels explained: Level 3, 4, 6 and 7",
    seoTitle: "Apprenticeship levels explained: Level 4 vs Level 6",
    description:
      "What Level 2, 3, 4, 5, 6 and 7 apprenticeships mean, which are degree apprenticeships, how long each takes, and how the levels differ in Scotland, Wales and Northern Ireland.",
    intro:
      "Apprenticeship levels match school and university qualifications. Level 3 is equal to A-level, Levels 4 and 5 are higher apprenticeships (foundation degree and above), and Levels 6 and 7 are degree apprenticeships that lead to a bachelor's or master's degree. The employer's advert should state the level, and some do not.",
    sections: [
      {
        heading: "The levels at a glance",
        paragraphs: ["This is GOV.UK's table of apprenticeship levels."],
        bullets: [
          "Foundation and intermediate, Level 2: equal to GCSE.",
          "Advanced, Level 3: equal to A-level.",
          "Higher, Levels 4, 5, 6 and 7: equal to a foundation degree and above.",
          "Degree, Levels 6 and 7: equal to a bachelor's or master's degree.",
        ],
      },
      {
        heading: "Level 4 and 5: higher apprenticeships",
        paragraphs: [
          "GOV.UK places Levels 4 and 5 under \"higher\" apprenticeships, equal to a foundation degree and above, and gives the bachelor's or master's equivalent only for Levels 6 and 7. So a Level 4 or 5 apprenticeship is not the same as a degree apprenticeship, and you should check what qualification you finish with. Apprenticeships overall run from 8 months to 6 years, so the length depends on the type and level.",
        ],
      },
      {
        heading: "Level 6 and 7: degree apprenticeships",
        bullets: [
          "UCAS says a degree apprenticeship lets you gain a full undergraduate or master's degree while you work, and lasts three to six years depending on the course level.",
          "About 20% of your time is study, one or two days a week or in blocks, and about 80% is work, according to UCAS. GOV.UK says at least 20% of working hours must be training.",
          "Level 6 leads to a bachelor's degree. Level 7 leads to a master's, and in the vacancies we read, the solicitor apprenticeships were Level 7 over six years.",
          "Some employers label a Level 6 route a graduate apprenticeship, which is the Scottish name, so read what it leads to.",
        ],
      },
      {
        heading: "One employer, several levels",
        paragraphs: [
          "Many employers run more than one level, so \"apprenticeship\" and \"degree apprenticeship\" are not interchangeable. For example, AWE lists Level 3, Levels 4 and 5, and Level 6 (degree) routes, and Leonardo lists roles from Level 2 to Level 6. An employer such as Schroders offers a two-year apprenticeship accredited at Level 3 and Level 4, and we found no degree apprenticeship on its page. Our employer pages say which level an employer offers, or that it is not stated.",
        ],
      },
      {
        heading: "Eligibility",
        bullets: [
          "You must be 16 or over, living in England and not in full-time education, according to GOV.UK.",
          "Apprenticeships can run from 8 months to 6 years, depending on type and level.",
          "Relevant experience or qualifications can shorten the training, agreed with the provider and employer.",
        ],
      },
      {
        heading: "Scotland, Wales and Northern Ireland",
        bullets: [
          "England and Wales offer degree apprenticeships, with most options in England, according to UCAS.",
          "Scotland calls them graduate apprenticeships.",
          "Northern Ireland offers higher level apprenticeships, mostly Level 5 (foundation degree), with some up to Level 7.",
          "GOV.UK's apprenticeship rules apply to England. The other nations have separate systems.",
        ],
      },
    ],
    cta: { href: "/sectors", label: "Browse employers by sector", blurb: "See which employers offer degree level, and which offer other levels." },
    related: ["what-is-a-degree-apprenticeship", "degree-apprenticeship-vs-university", "degree-apprenticeship-entry-requirements"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: apprenticeship qualifications and levels", url: "https://www.gov.uk/apprenticeships-guide/qualifications-and-levels" },
      { label: "GOV.UK: apprenticeships guide", url: "https://www.gov.uk/apprenticeships-guide" },
      { label: "UCAS: degree apprenticeships", url: "https://www.ucas.com/apprenticeships/degree-apprenticeships" },
      { label: "AWE: apprenticeships", url: "https://www.awe.co.uk/careers/early-careers/apprenticeships/" },
      { label: "Leonardo apprenticeship opportunities", url: "https://careers.uk.leonardo.com/gb/en/early-careers/apprenticeships/opportunities" },
      { label: "Schroders: apprenticeships", url: "https://www.schroders.com/en-gb/uk/individual/about-us/careers/apprenticeships/" },
    ],
  },
  {
    slug: "how-to-apply-for-a-degree-apprenticeship",
    title: "How to apply for a degree apprenticeship, step by step",
    seoTitle: "How to apply for a degree apprenticeship: step by step",
    description:
      "How degree apprenticeship applications work: where to find vacancies, how to apply, the stages employers use, how many you can apply for and what to do if you are unsuccessful.",
    intro:
      "You apply for a degree apprenticeship much as you would for a job: find a vacancy, create an account, and submit an application to the employer, with no UCAS-style single cycle. Vacancies are advertised through the year, each with its own deadline, and you can apply for several apprenticeships and university courses at once.",
    sections: [
      {
        heading: "Step 1: find vacancies",
        bullets: [
          "Search the Find an apprenticeship service on GOV.UK, which covers England.",
          "UCAS also offers an apprenticeship search, and employers advertise on their own careers pages.",
          "Use our deadlines page to see which employers are open and which are opening soon.",
        ],
      },
      {
        heading: "Step 2: read the advert properly",
        bullets: [
          "Check the level, the qualification you gain, the length and the start date.",
          "Check the entry requirements and any rules about residency or security clearance.",
          "Note the closing date. Many employers fill places as they go, so apply early.",
        ],
      },
      {
        heading: "Step 3: apply",
        paragraphs: [
          "GOV.UK describes three steps: search for an apprenticeship, sign in or create an account, then complete and submit the application. Many vacancy pages we read say to sign in or create an account on Find an apprenticeship, then apply on the employer's own website. UCAS says you apply in the same way you apply for a normal job, with a CV and cover letter, and that each vacancy states its own deadline and start date.",
        ],
      },
      {
        heading: "Step 4: the stages after you apply",
        paragraphs: ["The stages depend on the employer, and the advert or careers page should list them. Examples we read:"],
        bullets: [
          "Unilever: online application, online assessments (situational judgement, numerical and verbal reasoning), a video interview and an in-person Discovery Centre.",
          "Neptune North: CV review, a coding assessment, an aptitude assessment, a first-stage interview and an in-person assessment centre.",
          "AWE: online application, an online assessment with practice available, an assessment centre, an offer and then security clearance.",
          "Leonardo: an application form with security verification, a one-way video screening, an interview and an offer.",
        ],
      },
      {
        heading: "How many can you apply for?",
        paragraphs: [
          "UCAS says you are free to apply for multiple degree apprenticeships and traditional university courses at the same time. Some employers limit you to one programme, so check: Unilever considers only your first application, and AWE asks you to apply for only one apprenticeship.",
        ],
      },
      {
        heading: "If you are unsuccessful",
        bullets: [
          "Ask for feedback. GOV.UK says you can, and that you can complain if you think you were treated unfairly or discriminated against.",
          "Some employers let you reapply the next year, as M&G says, so a no is not always final.",
          "Keep your university applications going in parallel so you keep both options open.",
        ],
      },
    ],
    cta: { href: "/deadlines", label: "See who is open now", blurb: "Closing dates for the 2027 intake, soonest first, with the date each was last checked." },
    related: ["when-do-degree-apprenticeships-open", "degree-apprenticeship-personal-statement", "assessment-centre-tips"],
    updated: "2026-11-20",
    sources: [
      { label: "GOV.UK: apply for an apprenticeship", url: "https://www.gov.uk/become-apprentice/apply-for-an-apprenticeship" },
      { label: "GOV.UK: find an apprenticeship", url: "https://www.gov.uk/apply-apprenticeship" },
      { label: "UCAS: degree apprenticeships", url: "https://www.ucas.com/apprenticeships/degree-apprenticeships" },
      { label: "Unilever packaging apprenticeship", url: "https://careers.unilever.com/en/uk-and-ireland-early-careers-apprenticeships-packaging-professional-level-6" },
      { label: "Neptune North vacancy", url: "https://job-boards.eu.greenhouse.io/neptunenorth/jobs/4910464101" },
      { label: "AWE: apprenticeships", url: "https://www.awe.co.uk/careers/early-careers/apprenticeships/" },
      { label: "Leonardo apprenticeship opportunities", url: "https://careers.uk.leonardo.com/gb/en/early-careers/apprenticeships/opportunities" },
      { label: "M&G: routes into M&G FAQs", url: "https://group.mandg.com/careers/routes-into-mandg/faqs" },
    ],
  },
  {
    slug: "video-interview-tips-hirevue",
    title: "HireVue and one-way video interview tips for degree apprenticeships",
    seoTitle: "HireVue video interview tips for degree apprenticeships",
    description:
      "How one-way video interviews work, what HireVue says about question numbers and timing, how to prepare, the questions candidates report, and what to check in your invitation.",
    intro:
      "A one-way video interview has you record answers to on-screen questions with no interviewer present. HireVue says most have 5 to 8 questions, about 30 seconds to think and up to 3 minutes to answer, with one practice question you can repeat. The employer sets the exact numbers, and retakes on the real questions are often none.",
    sections: [
      {
        heading: "What to expect",
        bullets: [
          "You read or hear a question, get thinking time, then record your answer to the camera. The employer reviews the recording later.",
          "The employer chooses the number of questions, the thinking time, the answer time and whether you can re-record. Your invitation is the only reliable source for your interview.",
          "There is one practice question you can redo as often as you like. Use it to check your sound, lighting and framing.",
          "Employers describe the length differently. Goldman Sachs says its video stage takes about 30 minutes in total.",
          "Some employers pair a video interview with games or tests in the same stage, so read the whole invitation.",
        ],
      },
      {
        heading: "Before you record",
        bullets: [
          "Use a quiet room, a stable internet connection and a laptop or computer if the invitation allows. Test your camera and microphone.",
          "Face a window or lamp so your face is lit from the front, and put the camera at eye level.",
          "Have a glass of water and a blank sheet of paper beside you. Check whether the invitation allows notes, and do not read from a script.",
          "Close other apps and silence your phone so nothing interrupts the recording.",
          "If you need adjustments, tell the employer before the stage, not during it.",
        ],
      },
      {
        heading: "How to answer",
        bullets: [
          "Use the thinking time to pick one example and jot three words, not to write sentences.",
          "For experience questions, use STAR: the situation, your task, what you did and the result. Spend most of your time on what you did and what happened.",
          "Aim to use most of the answer time without rushing the end. A clear answer that finishes a little early beats one that is cut off mid-sentence.",
          "Speak to the camera as if to one person. A short pause to think is fine.",
          "Examples from school, part-time work, sport, volunteering or clubs are fine for most questions, so do not wait until you have a job to talk about.",
        ],
      },
      {
        heading: "Questions candidates report",
        paragraphs: [
          "These come from candidate and prep-site reports, mostly from graduate and internship routes, so treat them as the kind of question to expect and not a script. Employers change their questions.",
        ],
        bullets: [
          "Why this firm, and why this business area or role? Reported for several banks.",
          "Why an apprenticeship rather than a traditional degree? Reported for J.P. Morgan.",
          "A time you organised something, and a time something did not go to plan. Reported for UBS degree apprentices.",
          "Handling several deadlines at once and how you prioritised. A decision made with incomplete information. A time a team project went wrong. Reported for Goldman Sachs.",
          "A recent news story you followed. A current affairs question is reported for UBS.",
        ],
      },
      {
        heading: "What about scoring?",
        paragraphs: [
          "Employers rarely say whether recordings are scored by software, reviewed by people or both. Do not rely on claims about vocal tone or keywords from prep blogs: HireVue does not publish that. Answer clearly and honestly, with real examples, and check your invitation for anything the employer says about how it reviews recordings.",
        ],
      },
      {
        heading: "Practise it properly",
        bullets: [
          "Record yourself answering one question aloud and watch it back for pace, eye contact and filler words.",
          "Practise with our timed video interview, which follows the typical 30 seconds to think and about 2 minutes to answer.",
          "Prepare four or five STAR stories that can be reshaped for different questions, and a short, specific answer to why this employer.",
        ],
      },
    ],
    cta: { href: "/interview", label: "Practise a video interview", blurb: "Timed one-way video practice with feedback on your answers." },
    related: ["degree-apprenticeship-interview-questions", "how-to-answer-why-this-company", "assessment-centre-tips"],
    updated: "2026-11-20",
    sources: [
      { label: "HireVue: interview tips for candidates", url: "https://www.hirevue.com/candidates/interview-tips" },
      { label: "Goldman Sachs: how to prepare", url: "https://www.goldmansachs.com/careers/students/prepare" },
      { label: "The Student Room: UBS degree apprenticeship thread (candidate reports)", url: "https://www.thestudentroom.co.uk/showthread.php?t=7545577" },
      { label: "IGotAnOffer: J.P. Morgan HireVue interview (prep site, reported questions)", url: "https://igotanoffer.com/blogs/finance/jpm-hirevue-interview" },
    ],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
