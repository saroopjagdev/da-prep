// Original verbal reasoning passages with true / false / cannot say statements. Hand-written: every statement was
// checked against its passage. "Cannot say" means the passage does not give enough information either way.

import type { Item, Stimulus, TfAnswer } from "@/lib/assess/types";

type Statement = [text: string, answer: TfAnswer, why: string];

const GROUPS: { id: string; title: string; body: string; statements: Statement[] }[] = [
  {
    id: "vtf-g1",
    title: "Brightwater Logistics",
    body:
      "Brightwater Logistics introduced a delivery window system in 2023. Customers choose a morning, afternoon or evening window, and drivers receive updated routes each night. In the first year, missed deliveries fell from 8 per cent to 5 per cent, although the company reports that fuel costs rose because routes became less direct. Evening windows are the most popular, chosen for about half of all orders. Brightwater plans to extend the system to its two smaller depots next year, provided that driver turnover, which stood at 14 per cent in 2023, does not increase.",
    statements: [
      ["Missed deliveries fell by three percentage points in the first year.", 0, "They fell from 8 per cent to 5 per cent, which is a fall of three percentage points."],
      ["Fuel costs rose after the delivery window system was introduced.", 0, "The passage says the company reports that fuel costs rose because routes became less direct."],
      ["Morning windows are the most popular choice.", 1, "The passage says evening windows are the most popular."],
      ["The system is already in use at the two smaller depots.", 1, "The passage says Brightwater plans to extend it to them next year."],
      ["The delivery window system has increased Brightwater's profits.", 2, "The passage gives no information about profits."],
      ["Driver turnover is now higher than it was in 2023.", 2, "Only the 2023 figure (14 per cent) is given, so the current level cannot be known."],
    ],
  },
  {
    id: "vtf-g2",
    title: "Northfield College",
    body:
      "Northfield College runs degree apprenticeships in engineering, digital and business. Apprentices spend four days a week at work and one day at college. Employers pay no course fees for apprentices because the programmes are funded through the apprenticeship levy or by government co-investment. The college reports that 92 per cent of apprentices who started in 2021 completed their programme, compared with a national completion rate of 64 per cent. Applications are made to the employer, not to the college, and each employer sets its own selection process.",
    statements: [
      ["Apprentices at Northfield College spend one day a week at college.", 0, "Four days at work and one day at college."],
      ["Northfield's completion rate for apprentices starting in 2021 was higher than the national rate.", 0, "92 per cent compared with 64 per cent nationally."],
      ["Apprentices apply directly to Northfield College.", 1, "The passage says applications are made to the employer, not the college."],
      ["Employers must pay the full course fees for each apprentice.", 1, "Employers pay no course fees, because the programmes are funded through the levy or co-investment."],
      ["Engineering apprentices at Northfield earn more than business apprentices.", 2, "The passage says nothing about pay."],
      ["Most apprentices at Northfield are under 19.", 2, "No information about apprentices' ages is given."],
    ],
  },
  {
    id: "vtf-g3",
    title: "Office working survey",
    body:
      "A survey of 1,200 office workers found that 58 per cent preferred a hybrid pattern of working, with two or three days at home each week. Fewer than one in five wanted to work entirely from the office. Among workers aged under 25, however, the preference for office-based work was noticeably stronger than in other age groups, with respondents citing easier learning from colleagues. The survey did not ask about commuting costs, and the authors caution that results may differ in sectors where remote work is not possible.",
    statements: [
      ["A majority of respondents preferred hybrid working.", 0, "58 per cent is more than half."],
      ["Fewer than 240 respondents wanted to work entirely from the office.", 0, "Fewer than one in five of 1,200 is fewer than 240."],
      ["Workers under 25 were less keen on office-based work than other age groups.", 1, "The passage says their preference for office-based work was stronger."],
      ["The survey asked respondents about their commuting costs.", 1, "The passage says it did not."],
      ["Hybrid workers are more productive than office-only workers.", 2, "Productivity is not mentioned."],
      ["Most workers under 25 wanted to work entirely from the office.", 2, "Their preference was stronger than other groups', but the passage does not say it was a majority."],
    ],
  },
  {
    id: "vtf-g4",
    title: "Harbour Building Society",
    body:
      "Harbour Building Society lends mainly to first-time buyers in the south-west. In the year to March 2026 it approved 4,800 new mortgages, 600 more than in the previous year. The share of borrowers more than three months behind on their payments rose from 0.9 per cent to 1.1 per cent, which the society links to higher interest rates. Harbour says it contacts any borrower who misses a single payment within five working days and offers a payment plan before taking any further action. It does not lend on buy-to-let properties.",
    statements: [
      ["Harbour approved 4,200 new mortgages in the year to March 2025.", 0, "4,800 in the year to March 2026 was 600 more than the previous year, so the previous year was 4,200."],
      ["Harbour offers a payment plan before taking further action when a borrower falls behind.", 0, "The passage says it offers a payment plan before taking any further action."],
      ["The share of borrowers more than three months behind fell during the year.", 1, "It rose from 0.9 per cent to 1.1 per cent."],
      ["Harbour lends on buy-to-let properties.", 1, "The passage says it does not."],
      ["Harbour's profits fell because more borrowers were behind on payments.", 2, "Profits are not mentioned."],
      ["Harbour has more branches than any other building society in the south-west.", 2, "Branch numbers are not mentioned."],
    ],
  },
  {
    id: "vtf-g5",
    title: "Kestrel Global Equity Fund",
    body:
      "The Kestrel Global Equity Fund invests in the shares of large companies across 30 countries. Over the five years to the end of 2025 it returned 41 per cent after fees, while its benchmark index returned 46 per cent. The fund charges an annual fee of 0.75 per cent. Kestrel's managers argue that the fund carries less risk than the index because it avoids companies with high levels of debt. In 2026 the firm launched a cheaper index-tracking version of the fund, which simply copies the benchmark.",
    statements: [
      ["Over the five years to 2025, the fund returned less than its benchmark after fees.", 0, "41 per cent compared with 46 per cent."],
      ["The fund's annual fee is less than 1 per cent.", 0, "The fee is 0.75 per cent."],
      ["The fund only invests in UK companies.", 1, "It invests across 30 countries."],
      ["The index-tracking version was launched before 2026.", 1, "It was launched in 2026."],
      ["The fund's value rose and fell less than its benchmark over the five years.", 2, "The managers argue it carries less risk, but the passage gives no evidence of how much its value moved."],
      ["More money has gone into the index-tracking version than into the original fund.", 2, "No figures are given for either version's investments."],
    ],
  },
  {
    id: "vtf-g6",
    title: "Meridian Bank payments outage",
    body:
      "On a Friday in June, a software update at Meridian Bank caused card payments to fail for around four hours. About 1.3 million customers were affected. Meridian apologised the same day and said it would refund any charges customers incurred elsewhere as a result, such as late-payment fees, if they sent evidence within 60 days. The bank's internal review found that the update had been tested, but not under the high volume of transactions typical of a Friday afternoon. The regulator has said it is gathering information.",
    statements: [
      ["Card payments failed for around four hours.", 0, "The passage says payments failed for around four hours."],
      ["Customers must send evidence to have charges from other firms refunded.", 0, "Refunds depend on customers sending evidence within 60 days."],
      ["The software update had not been tested before it was released.", 1, "It had been tested, but not under Friday-afternoon volumes."],
      ["Meridian waited several days before apologising.", 1, "It apologised the same day."],
      ["The regulator will fine Meridian.", 2, "The regulator is only gathering information; no outcome is given."],
      ["Online banking was also unavailable during the outage.", 2, "Only card payments are mentioned."],
    ],
  },
  {
    id: "vtf-g7",
    title: "Calder & Finch",
    body:
      "Calder & Finch, an accountancy firm with 14 offices, hired 120 school leavers onto its audit apprenticeship in 2025, up from 80 in 2023. Over the same period its graduate intake fell from 150 to 130. The firm says apprentices who complete the programme gain the same professional qualification as graduates, but take about a year longer to qualify. Every apprentice is assigned a mentor in their first month. The firm has not published retention figures for either group.",
    statements: [
      ["Calder & Finch hired more audit apprentices in 2025 than in 2023.", 0, "120 in 2025 compared with 80 in 2023."],
      ["In 2025 the firm's graduate intake was larger than its audit apprentice intake.", 0, "130 graduates compared with 120 apprentices."],
      ["Apprentices qualify faster than graduates.", 1, "They take about a year longer."],
      ["Apprentices are given a mentor after their first year.", 1, "Every apprentice gets a mentor in their first month."],
      ["Apprentices are more likely than graduates to stay at the firm.", 2, "The firm has not published retention figures."],
      ["All 14 offices take audit apprentices.", 2, "The passage does not say which offices take apprentices."],
    ],
  },
  {
    id: "vtf-g8",
    title: "Avaria interest rate decision",
    body:
      "At its May meeting, the central bank of Avaria held its main interest rate at 4.25 per cent. Seven of the nine committee members voted to hold, while two voted for a cut of 0.25 percentage points. Inflation had fallen to 2.8 per cent, still above the 2 per cent target. The committee said it expected inflation to reach the target within two years, but warned that wage growth remained strong. Commercial banks in Avaria typically change their savings rates within a few weeks of a change in the main rate.",
    statements: [
      ["Most committee members voted to keep the rate unchanged.", 0, "Seven of the nine voted to hold."],
      ["Inflation was above the target at the time of the meeting.", 0, "2.8 per cent is above the 2 per cent target."],
      ["Two committee members voted to raise the interest rate.", 1, "The two voted for a cut, not a rise."],
      ["The committee said inflation had already returned to target.", 1, "It expected inflation to reach the target within two years."],
      ["Avaria's main interest rate will be cut at the next meeting.", 2, "The passage does not say what will happen next."],
      ["Commercial banks in Avaria lowered their savings rates after the May meeting.", 2, "The passage does not say what banks did after the meeting."],
    ],
  },
  {
    id: "vtf-g9",
    title: "Harlow Rail Services",
    body:
      "Harlow Rail Services maintains track and signalling on three regional lines. Last year it replaced 40 kilometres of track, about a fifth more than the year before, and completed all of the work during planned overnight closures. The company says safety inspections now take place every two weeks rather than monthly. Three minor incidents were reported, none involving passengers. Harlow has begun trialling sensors that detect track faults early, but a decision on fitting them across all three lines will not be made until the trial ends next spring.",
    statements: [
      ["Harlow replaced more track last year than the year before.", 0, "40 kilometres is about a fifth more than the year before."],
      ["Safety inspections are now carried out more often than they used to be.", 0, "Every two weeks instead of monthly."],
      ["Some track work took place during the daytime.", 1, "All of the work was completed during planned overnight closures."],
      ["Passengers were involved in the incidents reported last year.", 1, "None of the three minor incidents involved passengers."],
      ["The fault-detecting sensors will be fitted on every line.", 2, "A decision will not be made until the trial ends."],
      ["Harlow's maintenance costs fell last year.", 2, "The passage gives no information about costs."],
    ],
  },
  {
    id: "vtf-g10",
    title: "Remote working review",
    body:
      "A review of 2,000 employees at a UK insurer found that staff who worked from home two or three days a week reported higher job satisfaction than those who worked entirely in the office. Staff who worked from home five days a week reported the lowest sense of connection with colleagues. Managers rated the output of all three groups as similar. The authors caution that employees chose their own arrangements, so the results may reflect differences between the people involved rather than the effect of the arrangement itself.",
    statements: [
      ["Part-time home workers reported higher satisfaction than full-time office workers.", 0, "Staff working from home two or three days a week reported higher satisfaction than those entirely in the office."],
      ["Managers saw little difference in output between the groups.", 0, "Managers rated the output of all three groups as similar."],
      ["Employees working from home five days a week felt the most connected to colleagues.", 1, "They reported the lowest sense of connection."],
      ["The employees were assigned to their working arrangements by the researchers.", 1, "Employees chose their own arrangements."],
      ["Working from home causes higher job satisfaction.", 2, "The authors warn the results may reflect differences between people, so cause cannot be concluded."],
      ["Staff who work in the office are more likely to be promoted.", 2, "Promotion is not mentioned."],
    ],
  },
  {
    id: "vtf-g11",
    title: "Tamsin Energy trial",
    body:
      "Tamsin Energy offered 5,000 households a tariff that charges less for electricity used overnight. After six months, 38 per cent of participating households had moved some use, such as running washing machines, to the night-time period. Households with electric vehicles were the most likely to shift. Tamsin says the shift reduced demand at peak times by an amount equal to about 600 homes. Customer complaints about the tariff were lower than for the company's standard tariff, although Tamsin accepts that people who volunteer for a trial may be more positive than average.",
    statements: [
      ["Fewer than half of the participating households shifted any of their electricity use.", 0, "38 per cent is fewer than half."],
      ["Households with electric vehicles were the most likely to shift use to night-time.", 0, "The passage says they were the most likely to shift."],
      ["Every participating household moved some of its electricity use to the night-time period.", 1, "Only 38 per cent of households shifted any use."],
      ["The trial lasted for a year.", 1, "Results are given after six months."],
      ["The tariff will be offered to all of Tamsin's customers.", 2, "No plans for wider roll-out are mentioned."],
      ["Households with solar panels were the least likely to shift use.", 2, "The passage does not mention solar panels."],
    ],
  },
  {
    id: "vtf-g12",
    title: "Whitcombe Library",
    body:
      "Whitcombe Library extended its opening hours in January, adding Sunday afternoons and two late evenings a week. Visits rose by 22 per cent over the following six months. The library says most of the extra visits were from people aged under 25, many of whom use the study spaces. The extension is paid for by a council grant that ends in December. The council has said it will review the library's funding in the autumn, and has not committed to continuing the longer hours after the grant ends.",
    statements: [
      ["Visits to Whitcombe Library increased after the opening hours were extended.", 0, "Visits rose by 22 per cent."],
      ["The longer opening hours are currently funded by a council grant.", 0, "The extension is paid for by a council grant that ends in December."],
      ["Visits rose by less than ten per cent over the six months.", 1, "They rose by 22 per cent."],
      ["The council has promised to keep the longer hours after December.", 1, "The council has not committed to continuing them."],
      ["Most of the new visitors are students at the local college.", 2, "The passage says people aged under 25 but not whether they are students."],
      ["Visits fell in the first month after the change.", 2, "Only the six-month total is given."],
    ],
  },
];

export const VERBAL_TF_STIMULI: Record<string, Stimulus> = Object.fromEntries(
  GROUPS.map((g) => [g.id, { type: "text", title: g.title, body: g.body } satisfies Stimulus]),
);

export const VERBAL_TF: Item[] = GROUPS.flatMap((g) =>
  g.statements.map(
    ([text, answer, why], i): Item => ({
      id: `${g.id}-${i + 1}`,
      kind: "tf-cannot-say",
      stimulus: g.id,
      prompt: text,
      answer,
      explanation: why,
      difficulty: 3,
    }),
  ),
);
