#!/usr/bin/env node
// UserPromptSubmit hook: when teja corrects the agent, say so — every time.
//
// WHY THIS EXISTS. `.claude/learnings/` only works if entries get written, and
// until now that depended on the agent noticing it had been corrected and
// choosing to act. It is a skill: discoverable, not compulsory. Which means the
// one moment it matters — mid-correction, mid-task, with something else to fix —
// is exactly when it gets skipped.
//
// This fires on the USER'S OWN WORDS rather than on the agent's judgement, so it
// is deterministic. The transcripts made the vocabulary obvious: 38 real
// corrections since July, and nearly all of them open with the same handful of
// phrases.
//
// It only ever ADDS context. It cannot block a prompt, cannot alter it, and
// exits 0 on every path — a nudge that can break the session is not worth having.
//
// Test:  echo '{"prompt":"no, we already have a Select for that"}' | node scripts/hooks/learning-nudge.mjs
import fs from 'node:fs';

/**
 * Phrases that mean "you got that wrong", drawn from real corrections in this
 * project's history rather than guessed:
 *
 *   "for select we already have a component with left icon then why are you flagging it"
 *   "don't add the mobile design in the xui design system file"
 *   "use whatever we have in figma xui font styles, don't reinvent anything"
 *   "we don't need gradient isolation"
 *
 * Deliberately narrow. A nudge that fires on every third message is noise, and
 * noise gets ignored — which would leave us worse off than no hook at all.
 */
const CORRECTION = new RegExp(
  [
    String.raw`\bdon'?t\b`,
    String.raw`\bdo not\b`,
    String.raw`\bnever\b`,
    String.raw`\bwe already have\b`,
    String.raw`\bwhy (?:are|did) you\b`,
    String.raw`\bthat'?s wrong\b`,
    String.raw`\bnot like that\b`,
    String.raw`\binstead of\b`,
    String.raw`\buse whatever\b`,
    String.raw`^no[,.\s]`,
    String.raw`\bstop\b`,
    String.raw`\bshould ?n'?o?t\b`,
    String.raw`\bremove the\b`,
    String.raw`\bremember (?:this|that)\b`,
    String.raw`\bnote (?:this|that) down\b`,
  ].join('|'),
  'i',
);

/** Questions that merely contain "don't" are not corrections. */
const NOT_A_CORRECTION = /^\s*(?:what|how|why is|why do|can|could|should i|is there|does)\b/i;

let raw = '';
try {
  raw = fs.readFileSync(0, 'utf8');
} catch {
  process.exit(0);
}

let prompt = '';
try {
  prompt = String(JSON.parse(raw).prompt ?? '');
} catch {
  process.exit(0);
}

const text = prompt.trim();

// A long message is usually a brief, not a correction; a very short one has no
// room to carry a rule worth writing down.
if (text.length < 12 || text.length > 600) process.exit(0);
if (NOT_A_CORRECTION.test(text)) process.exit(0);
if (!CORRECTION.test(text)) process.exit(0);

process.stdout.write(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: 'UserPromptSubmit',
      additionalContext:
        'That message reads as a CORRECTION. After you have acted on it, add a learning: ' +
        'append an entry to the right bucket in .claude/learnings/ with kind `owner-correction`, ' +
        "today's date, the author from `git config user.name`, and a confidence. Quote what was " +
        'actually said. See the capture-learning skill for the format and which file. ' +
        'If it turns out not to be a correction, or the point is already recorded there, ignore ' +
        'this and do not mention it.',
    },
  }),
);
