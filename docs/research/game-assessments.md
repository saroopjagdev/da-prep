# Game-based assessments: what each provider actually uses, and where our practice games fall short

Research date: 2026-11-28. Every mechanic below comes from **third-party prep sites and candidate reports**. No provider publishes its task list, round counts or scoring (Arctic Shores' own help page returned 403, Harver's pages name no mechanics, Oxford's careers page has been removed). Treat round counts as approximate and prefer the published cognitive-science paradigm where one exists.

What "accurate" can honestly mean here: the same *task type*, the same *rules a candidate sees*, similar *round counts and pacing*, and a similar *look and feel*. It cannot mean the provider's real stimuli, adaptive algorithms or scoring. Our existing disclaimer already says this and should stay.

## Provider inventory

### Arctic Shores (UK graduate favourite: Deloitte, RBS, Vodafone, Airbus reported)
Up to nine tasks, chosen by the employer. Practice sites list 10 to 16 names; none is official. Results are trait profiles against a benchmark, not a score.

| Task | How it plays (reported) | Confidence |
|---|---|---|
| Balloon (Balloon Burst) | Pump to earn; burst loses that balloon's earnings; bank anytime. About 45 balloons reported, small fixed value per pump. Untimed. | Medium (several sites agree) |
| Direction | Arrows (flanker): press Q if the centre arrow points left, P if right; surrounding arrows distract. About 80 rounds, speed task. | Medium |
| Tickets | A ticket with a number and a shape appears at the top or bottom of the screen; position decides whether to judge number or shape (task switching). About 80 tickets. | Medium |
| Security | Lock-picking: stop a rotating part of the lock on the highlighted number; four locks, one miss resets. Timing/precision. Untimed. | Low-medium |
| Order | Pattern: three frames change by rules (colour, size, direction, position); pick the fourth. | Medium |
| Sequence | Tiles light in order; click back in order. | Medium |
| Analysis | Timed multiple choice from tables and charts. | Low |
| Emotions | Read an expression. | Low |
| Team Sales, Energy, Balance, Predict (Night and Day), Pattern | Names reported; mechanics not described in any source we could read. | Very low |

### pymetrics / Harver Behavioural (Unilever, BCG, JP Morgan, Accenture, Goldman reported)
Harver says "12+" games, about 25 minutes, no right answers, traits: effort, risk tolerance, decision making, attention, focus, learning, fairness, generosity, emotion. Most games are classic neuroscience paradigms.

| Game | Underlying paradigm | Reported mechanics | Confidence |
|---|---|---|---|
| Balloons | Balloon Analogue Risk Task | Pump for money; coloured balloons with different pop probabilities; no time limit; about 39 rounds | Medium |
| Cards | Iowa Gambling Task style | Four decks with hidden gain and loss patterns; learn which are good | Medium |
| Digits | Digit span | Digits shown one at a time, type back in order; longer when right | High |
| Easy or Hard | Effort Expenditure for Rewards Task | Repeated choice: quick low-reward task vs longer high-reward task (the task is rapid key presses) | Medium |
| Faces | Emotion recognition | Photo of a face (sometimes with a short story); choose the emotion | Medium |
| Keypresses | Speed / motor tapping | Press the spacebar as fast as you can for a set time, then stop | Medium |
| Money Exchange 1 and 2 | Trust game and ultimatum / dictator-style game | 10 rounds: send money (tripled) to a partner who may return some; later, propose or accept splits; a refusal leaves both with nothing | Medium |
| Stop | Stop-signal / go-no-go | Circles flash; press for one, hold back for the other; about 120 fast trials | Medium |
| Towers | Tower of London style | Move top disc between three towers to a **target configuration** (not the classic "stack onto the right peg"); about 8 rounds | Low-medium |
| Lengths | Perceptual discrimination | Two stimuli (bars or a face's mouth); choose the longer; about 90 rounds, about 2 seconds each | Low (sources disagree on the stimulus) |
| Arrows | Flanker task | Colour rule: for blue/black sets answer the middle arrow, for red sets the side arrows; about 90 to 135 sets over about 3 minutes | Medium |
| Magnitudes, Sequences, Shapes, Letters | Newer cognitive extras | Names only | Very low |

### HireVue games (Santander, National Grid, Shell reported)
Cognitive set per HireVue's own I-O research: Digitspan, Puzzlepicture, Pathfinder, Flashback, Numerosity, Singularity, Shapedance; plus emotion recognition and a forced-choice personality game. Prep sites say "13".

| Game | Reported mechanics | Confidence |
|---|---|---|
| Flashback | N-back: is the current shape the same as the one N steps ago; about 3 minutes; widely rated hardest | Medium |
| Digitspan | Digit span with chunking advice | High |
| Pathfinder | Rearrange tile pieces into one continuous route between two endpoints; about 5 minutes | Medium |
| Numerosity | Mental arithmetic: pick the numbers that make the target under the shown operation; starts with addition and ends with division; about 15 seconds per level; adaptive | Medium |
| Shapedance | Find every card with the same pattern even when rotated or spinning; press Compare | Medium |
| Puzzlepicture | Remember a complete image, then rebuild its scrambled layout | Medium |
| Singularity | Find the unique image among others | Low |

### Aon (cut-e) smartPredict (P&G, Rolls-Royce, Siemens reported)
Four games, adaptive, roughly 6 minutes each (Grid about 9, some sources say 5).

| Game | Mechanics | Confidence |
|---|---|---|
| Switch | Work out the code (operator) that turns one order of shapes into another | Medium (we have a replica) |
| Grid | Memorise lit cells while answering symmetry questions between rounds | Medium |
| Digit | Fill missing digits in equations, each of 1 to 9 once; 2 to 4 blanks; more than one fill may work | Medium |
| Motion | Sliding-block puzzle: slide blocks so a ball reaches the exit in the fewest moves; harder boards | Medium |

### Others (not yet researched in depth)
Revelian Cognify (replaced Theme Park Hero; six games including Tally Up numerical and a rotation pattern task), Sova (no game names found), SHL Verify Interactive, Saville, Criteria, Cappfinity, Thomas, Plum, Owiwi, Mindx. Needs a separate pass.

## Gap analysis against what we ship today (11 games)

| Our game | Closest real task | Problems |
|---|---|---|
| Balloon bank | Arctic Shores / pymetrics balloon | We use **10 balloons**; real ones are reported at about 39 to 45. No coloured-balloon variation. |
| Four decks | pymetrics Cards (IGT) | **40 cards** is shorter than a normal IGT; deck payoffs not documented against the published IGT schedule. |
| Tower | pymetrics Towers | We use classic Hanoi (discs onto the right peg). The real task is reported as **reaching a target configuration** over about 8 rounds. Wrong task. |
| Digit span | pymetrics Digits, HireVue Digitspan | Probably close. Needs the real feel (timing, keypad). |
| Flashback | HireVue Flashback | We built **1-back "same as previous"**. Sources describe N-back (shape N steps ago, rising N). Too easy. |
| Shape reaction | pymetrics Stop / go-no-go | We use **green circle vs red square**. Reported: red/green circles, or filled vs empty outline, about 120 fast trials. |
| Block sequence | Arctic Shores Sequence | Plausible. |
| Keypress | pymetrics Keypresses | We do press/wait cues; real task is a plain speed tapping run. |
| Money exchange | pymetrics Money Exchange | One game covers both; should be two with about 10 rounds each; ultimatum refusal rule (both get nothing). |
| Colour words | Stroop | Not reported for any named provider; a filler. |
| Switch puzzles | Aon Switch | Existing replica; keep. |

**Missing entirely** (reported for real providers): Arctic Shores Direction, Tickets, Security, Order; pymetrics Easy or Hard, Faces, Lengths, Arrows, Money Exchange 2, Towers (correct version); HireVue Pathfinder, Numerosity, Shapedance, Puzzlepicture, Singularity; Aon Grid, Digit, Motion.

## Build plan, highest value first

1. **Fix the five we got wrong or too easy:** Tower (target configuration, about 8 rounds), Flashback (N-back with rising N), Stop (go/no-go with circles, about 120 trials), Balloon (about 40 balloons, coloured variants), Money exchange (split into the trust and ultimatum games, 10 rounds each).
2. **Add the most-reported missing games:** Arctic Shores Direction (arrows flanker) and Tickets (task switch); pymetrics Easy or Hard and Faces; Aon Grid, Digit and Motion; HireVue Numerosity, Pathfinder and Shapedance.
3. **Visual pass:** one consistent game shell (dark stage, large stimulus, progress and timer chrome, keyboard and touch input, results screen that shows behaviour not a score).
4. **Re-source each game** to the best available description, show confidence ("reported by prep sites, not published by the provider"), and keep the disclaimer.
5. **Research the remaining providers** (Revelian Cognify, Sova, SHL Verify Interactive, Cappfinity) before building for them.

Open question for the owner: scope and order. Each game is roughly a day of build and test, so the list above is about 15 to 20 games of work.
