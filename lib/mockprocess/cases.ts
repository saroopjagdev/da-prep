// Original case-study and exercise stimuli for the mock processes. Invented scenarios and data: nothing here is taken
// from any employer's materials.

import type { Stimulus } from "@/lib/assess/types";

export const BAKERY_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "Hearth & Crumb is a bakery chain with four shops. The owner is considering starting a home delivery service from two of the shops. Delivery would need two vans and four part-time drivers. Look at the data, then in your answer: (1) say what the data suggests about where delivery is most likely to work, (2) name two risks, (3) say what other information you would want, and (4) give a clear recommendation.",
  stimulus: {
    type: "table",
    title: "Hearth & Crumb: last year's figures by shop",
    columns: ["Shop", "Annual sales (£k)", "Customers within 3 miles (thousand)", "Online enquiries per week", "Rent and rates (£k)"],
    rows: [
      ["Marlow Street", 410, 38, 52, 64],
      ["Riverside", 295, 21, 9, 41],
      ["Station Road", 360, 44, 47, 58],
      ["Oakfield", 180, 12, 4, 26],
    ],
    note: "A van costs about £9k a year to run. A part-time driver costs about £7k a year.",
  },
};

export const GYM_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "FitFirst, a local gym, is losing members in the first three months. A manager suggests cutting the monthly price. Study the figures. In your answer: (1) explain what the data does and does not show about why members leave, (2) suggest one or two ways to test your idea cheaply, (3) recommend what the gym should do next and why.",
  stimulus: {
    type: "table",
    title: "FitFirst: members leaving within three months, by joining month",
    columns: ["Joined in", "New members", "Left within 3 months", "Used the gym 8+ times in month 1", "Left (of those 8+ visits)"],
    rows: [
      ["January", 220, 88, 90, 9],
      ["April", 140, 42, 70, 6],
      ["July", 95, 38, 31, 4],
      ["October", 160, 56, 66, 7],
    ],
    note: "The monthly price has not changed during these months.",
  },
};

export const RECYCLING_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "A council wants to raise the share of household waste that is recycled. You have been given the figures for four neighbourhoods. In your answer: (1) say which neighbourhood needs help most and why, (2) point out one thing the data cannot tell you, (3) recommend a first step, with a way to check whether it worked.",
  stimulus: {
    type: "table",
    title: "Household waste by neighbourhood (tonnes per month)",
    columns: ["Neighbourhood", "Households", "Total waste", "Recycled", "Collection day changed this year"],
    rows: [
      ["Eastgate", 3200, 410, 148, "No"],
      ["Millbank", 2100, 290, 64, "Yes"],
      ["Hallfield", 2800, 350, 133, "No"],
      ["Priory", 1500, 205, 43, "Yes"],
    ],
  },
};

export const ENGINE_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "A small component on a test rig has failed twice in six months. You are given a summary of the three test runs so far. In ten minutes, explain what the data suggests, what you would check next, and what you recommend before the next run. Keep your language simple enough for a non-specialist colleague to follow.",
  stimulus: {
    type: "table",
    title: "Test rig: component failures",
    columns: ["Run", "Hours since service", "Operating temperature (°C)", "Vibration (mm/s)", "Outcome"],
    rows: [
      ["1", 120, 310, 2.1, "Passed"],
      ["2", 340, 355, 3.4, "Failed"],
      ["3", 95, 350, 3.2, "Passed"],
      ["4", 410, 312, 2.0, "Passed"],
      ["5", 360, 358, 3.6, "Failed"],
    ],
    note: "Runs 2 and 5 were the two failures. Runs are listed in the order they were carried out.",
  },
};

export const DELOITTE_TOPICS =
  "Choose ONE of these four topics and talk through it as you would with an assessor:\n1. How should organisations use artificial intelligence responsibly?\n2. What can businesses do to attract and keep young people?\n3. How should a company decide whether to expand overseas?\n4. What makes a business trustworthy?\nAim to cover facts, who is affected, the impact on clients or customers, and one argument against your own view.";

export const LLOYDS_EMAIL =
  "A customer emailed to say they were charged a £6 fee on their account that nobody warned them about. The fee was correct under the account terms. Write a reply of around 150 words. Show empathy, explain clearly, say what you can do to help, and keep a friendly, professional tone.";

export const RR_PRESENTATION =
  "Imagine you are presenting for seven minutes to a senior colleague from a different discipline. Explain a complex technical idea you understand well (it can be from school, a hobby or a project), say why it matters, and say what you learned or what skills you developed by understanding it. Give your presentation as you would in the room.";

// Finance cases for the investment-bank mocks (all invented).

export const SETTLEMENT_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "You are an operations apprentice. The number of trades that failed to settle on time rose this month, and the head of the desk wants a short update. Use the data. In your answer: (1) say what is driving the rise, (2) suggest two practical actions, (3) say what you would tell the trading desk, and (4) name one thing you would want to check before acting.",
  stimulus: {
    type: "table",
    title: "Failed settlements by cause (number of trades)",
    columns: ["Cause", "Last month", "This month", "Average value per failed trade (£k)"],
    rows: [
      ["Missing client settlement instructions", 14, 31, 180],
      ["Wrong trade details booked", 9, 11, 240],
      ["Counterparty did not deliver", 22, 24, 410],
      ["Cut-off time missed", 5, 6, 95],
    ],
    note: "A new client onboarding system went live at the start of this month. Total trades processed were about the same in both months.",
  },
};

export const RETAIL_BANK_CASE: { brief: string; stimulus: Stimulus } = {
  brief:
    "Northfield Bank is choosing which of three customer groups to target with a new savings account. Look at the data. In your answer: (1) say which group looks most attractive and why, (2) name one risk with your choice, (3) say what extra information you would want, and (4) give a clear recommendation in one sentence.",
  stimulus: {
    type: "table",
    title: "Northfield Bank: customer groups (illustrative figures)",
    columns: ["Group", "Customers (thousand)", "Average savings balance (£)", "Share using the mobile app", "Share who left the bank last year"],
    rows: [
      ["Students and graduates", 120, 900, "92%", "14%"],
      ["Young families", 210, 4200, "71%", "6%"],
      ["Retired customers", 160, 18500, "38%", "3%"],
    ],
    note: "A rival bank launched a high-interest app-only savings account six months ago.",
  },
};

export const GS_REASONING =
  "Estimate how many cups of coffee are sold in London on a typical weekday. There is no single right answer: talk through your assumptions step by step, give a final number, and say how you would sanity-check it.";

export const MARKETS_STORY =
  "Pick one recent market or economic story (for example an interest rate decision, a company's results, or a big move in a currency or commodity). Explain what happened, why it happened, and who in a bank's markets business would care and why. Keep it simple enough for someone outside finance to follow.";

export const HSBC_EMAIL =
  "You work in commercial banking. A small business client, a family-run furniture maker, emails to say a payment to their main supplier has not arrived and the supplier is threatening to pause deliveries. You have checked and the payment was held for a routine security check that should clear today. Write a reply of around 150 words: acknowledge the problem, explain clearly, say what happens next, and keep the client's trust.";

export const PITCH_60 =
  "In about a minute, introduce yourself to a managing director you meet at the assessment evening: who you are, why this programme, and one question you would ask them.";
