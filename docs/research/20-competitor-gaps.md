# Competitor gaps: what we closed and what is left

Scan date 9 November 2026, from the competitors' public marketing pages only (claims unverified; no product trials).
Sources: The Apprentice Guide (theapprenticeguide.net), Intervyo, Trackr, Mockly. "S&R Apprentice" could not be identified:
the nearest match, SR Apprenticeships, is a training provider and not a preparation tool. Earlier detail: `15-competitors.md`.

## Closed in this change

| Gap | What we built |
|---|---|
| Delivery feedback on spoken answers (Mockly, Intervyo) | `lib/delivery.ts`: time used, words a minute, filler words, tips, shown under each video answer. Worked out locally from the transcript. Pauses and eye contact are NOT measured, and the app says transcription can drop some ums and uhs. |
| Live interviewer that follows up (Intervyo) | Text mock interviews can ask one AI follow-up question after each answer (`/api/interview/followup`, off by default). The answer and follow-up are marked together. Falls back to a generic probe if the model fails. |
| CV and cover letter writing tools (Apprentice Guide, Intervyo) | `/cover-letter`: a five-part planner with the chosen employer's researched values and programmes, prompts, a word count, copy button and a saved-on-device draft. It is a planner, not a generator: the words stay the student's own. |
| Data safety statement (Mockly, Intervyo) | A clear three-line summary on the video setup screen (camera stays on device, voice sent once for transcription then discarded, nothing to delete) that matches the privacy notice. |

## Not done, and why

- **Pricing options (season pass, firm packs, top-up packs) and a money-back promise.** These are business and legal decisions that change what customers are charged or promised. Needs a decision from the owners before any Stripe change.
- **Video course.** Needs filming and scripting, not code.
- **Testimonials, "offers landed" logos and outcome statistics.** We have no real ones and will not invent them.
- **Eye-contact scoring.** Needs camera analysis and raises privacy questions.
- **Per-stage firm pages for search ("Barclays video interview 2027").** Possible from the existing profiles; low priority until the guides are reviewed.
- **Group chats and a coach chat.** Moderation and safeguarding cost for under-18s.
