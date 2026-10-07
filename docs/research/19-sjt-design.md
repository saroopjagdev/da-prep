# Situational judgement tests: how real ones are built, and how ours compare

Research date 6 October 2026. Seen via search summaries and official pages. Labels as in `12-online-assessments.md`: OFFICIAL, MULTI-REPORT, JUDGEMENT. Employer scoring keys are not public, so none of this lets us reproduce a real key.

## What real SJTs look like

| Point | Label | Source |
|---|---|---|
| Civil Service Judgement Test: scenarios (text or video), four actions each, rate every action Counterproductive / Ineffective / Fairly effective / Effective, actions judged independently; three scenarios per behaviour; scores reported as a percentile against a representative group, pass marks set by the department after closing | OFFICIAL | [GOV.UK](https://www.gov.uk/guidance/preparing-for-the-civil-service-judgement-test) |
| Four response formats are common: most/least effective, rate every option, rank, choose the single best action | MULTI-REPORT | [PracticeAptitudeTests](https://www.practiceaptitudetests.com/situational-judgement-tests/) |
| Difficulty comes from plausible trade-offs, not obvious answers: speed against caution, honesty against loyalty, personal limits against team support. Several options have merit; in ranking items "the middle positions are where the marks go" | MULTI-REPORT | as above |
| Typical situations: missed deadlines, colleague conflict, client errors, process flaws; the traps are picking unethical, passive or politically motivated options | MULTI-REPORT | as above |
| SHL SJT: about 24 questions, untimed, around 20 minutes suggested; scoring is either "most effective" (a point only if your top pick matches the expert key) or distance-based; keys are built from experts or high performers in the target organisation | MULTI-REPORT | [AssessmentDay](https://www.assessmentday.co.uk/situational-judgement-test.htm), [Intervyo](https://www.intervyo.co.uk/assessments/situational-judgement-test) |
| KPMG-style: four courses of action, choose one best and one worst for the applied role | MULTI-REPORT | [GraduatesFirst](https://www.graduatesfirst.com/kpmg-job-tests) |
| Employer keys differ: each firm judges "best" against its own competency framework | MULTI-REPORT | Intervyo, above |

## Audit of our original bank (`lib/assess/banks/sjt.ts`, 2 October 2026 content)

Measured on its 30 most/least items:

- The best answer is the longest option in **27 of 30 (90%)**; chance with four options is 25%.
- **80%** of best answers open with a communication verb (tell, speak, report, ask, explain); 13% of worst answers do.
- The worst answer is nearly always absurd (gossip, ignore, hide). Real items make the worst option plausible but harmful.
- One clear best and three clearly weaker options, where real items pit two or three reasonable options against each other.
- Mostly generic office scenarios; real tests are set in the employer's world.

Conclusion: the foundation bank teaches the behaviours but a high score overstates readiness. It is now labelled "foundation".

## Design rules for the stretch bank (`lib/assess/banks/sjt-hard.ts`)

1. Every option is something a reasonable person might do and has some merit. The worst option is a plausible-but-harmful choice (conceal, disclose, overstep), not a silly one.
2. The key is decided by a stated principle: ownership, honesty, telling the right person early, safety, confidentiality, staying within your authority. The explanation names the principle and says why each other option falls short.
3. Each scenario sets two values against each other (speed against process, loyalty against honesty, helpfulness against authority).
4. The best answer is not written to be the longest, and best answers do not share an opening word. Enforced by `tests/banks-sjt-hard.test.ts`.
5. Spread across finance, audit, engineering, tech, construction, public service and general work, because real SJTs are role-specific.
6. Scenarios avoid cases where reasonable experts would split. Where an item was ambiguous in drafting it was rewritten or dropped.
7. No pass mark or norm is claimed. The results say plainly that employer keys are unpublished.

## What shipped

- 24 most/least, 12 rate-each (ratings 0 to 3, ties allowed, spread of at least two levels) and 10 ranking items, difficulty 4.
- Three new catalogue tests marked "(stretch)", and the NatWest-style "Work scenarios" test now draws from the stretch pool.
- The original tests stay as "(foundation)" warm-ups.

## Limits and next steps

- The keys are our judgement of published employer behaviours. They have not been reviewed by an occupational psychologist or checked against real candidates' scores. A real validation would pilot the items with apprentices and compare to employer outcomes.
- Still missing: SJTs written in the voice of specific firms' values (Deloitte, PwC, KPMG, EY frameworks), a chat-style SJT (Morgan Stanley's ChatAssess), video scenarios, and a larger bank so retakes stay fresh.
