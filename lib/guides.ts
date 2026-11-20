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
    ],
    cta: { href: "/opportunities", label: "See who is open now", blurb: "Every employer we cover, with open, closing soon and opening soon in one list." },
    related: ["what-is-a-degree-apprenticeship", "degree-apprenticeship-interview-questions"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/guide", label: "Walk through each stage", blurb: "What happens at every stage of a typical application, and how to prepare." },
    related: ["degree-apprenticeship-vs-university", "degree-apprenticeship-personal-statement"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/review", label: "Get feedback out of 100", blurb: "Paste or upload your statement and see what to fix, with a stronger version of weak lines." },
    related: ["how-to-answer-why-this-company", "what-is-a-degree-apprenticeship"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/interview", label: "Practise an interview", blurb: "Answer out loud or in text and get a mark out of 100 with a stronger version of each answer." },
    related: ["how-to-answer-why-this-company", "assessment-centre-tips"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/practice", label: "Practise employer-style tests", blurb: "Timed numerical, verbal, logical and situational practice with explanations." },
    related: ["degree-apprenticeship-interview-questions", "assessment-centre-tips"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/employers", label: "Research an employer", blurb: "Employer guides with the process, values and programmes in one place." },
    related: ["degree-apprenticeship-personal-statement", "degree-apprenticeship-interview-questions"],
    updated: "2026-10-06",
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
    ],
    cta: { href: "/employers", label: "Practise a mock process", blurb: "Employer-style stages in order: tests, video interview, case study and final interview." },
    related: ["degree-apprenticeship-interview-questions", "numerical-verbal-reasoning-tests"],
    updated: "2026-10-06",
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
];

export const guideBySlug = (slug: string) => GUIDES.find((g) => g.slug === slug);
