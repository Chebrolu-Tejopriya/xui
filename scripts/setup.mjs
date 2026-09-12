#!/usr/bin/env node
// First-run setup. The designer does nothing; this does it.
//
// Everything a person needs to go from "I cloned a folder" to "I can build a
// screen with XUI and push it" — checked, done where possible, and stated
// plainly where it cannot be.
//
// RULES THIS FOLLOWS, because a setup script that breaks trust is worse than
// no setup script:
//
//   - Never install a package manager or Node behind someone's back. Report
//     what is missing and the one command that fixes it.
//   - Never fail on something optional. `gh` missing is a note, not an error.
//   - Say what it is about to do before doing anything slow.
//   - Finish by printing the ONE command they run next. Not three.
//
// Run it through `start.cmd` (Windows) or `start.command` (macOS) rather than
// directly — those exist so a person can double-click instead of opening a
// terminal, which is the actual barrier.
//
//   node scripts/setup.mjs
import { execSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const playground = path.resolve(root, '../xui-playground');

const C = process.stdout.isTTY
  ? { g: '\x1b[32m', r: '\x1b[31m', y: '\x1b[33m', d: '\x1b[2m', b: '\x1b[1m', x: '\x1b[0m' }
  : { g: '', r: '', y: '', d: '', b: '', x: '' };

const ok = (m) => console.log(`  ${C.g}✓${C.x} ${m}`);
const warn = (m) => console.log(`  ${C.y}!${C.x} ${m}`);
const bad = (m) => console.log(`  ${C.r}✗${C.x} ${m}`);
const head = (m) => console.log(`\n${C.b}${m}${C.x}`);

const problems = [];

/** Run a command for its output; null if it is not installed or fails. */
function tryRun(cmd) {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return null;
  }
}

/** Run a command for real, showing its output. */
function run(cmd, args, cwd) {
  const r = spawnSync(cmd, args, { cwd, stdio: 'inherit', shell: process.platform === 'win32' });
  return r.status === 0;
}

const ask = async (q) => {
  if (!process.stdin.isTTY) return '';
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const a = await new Promise((res) => rl.question(q, res));
  rl.close();
  return a.trim();
};

console.log(`
${C.b}  XUI — first-run setup${C.x}
  ${C.d}KoinX design system · this window does the work${C.x}
`);

/* ---- 1. the things we cannot install for you ------------------------------ */

head('Checking your machine');

const major = Number(process.versions.node.split('.')[0]);
if (major >= 22) ok(`Node.js ${process.versions.node}`);
else {
  bad(`Node.js ${process.versions.node} — XUI needs 22 or newer`);
  problems.push(
    process.platform === 'win32'
      ? 'Install Node 22+:  winget install OpenJS.NodeJS.LTS   (or nodejs.org)'
      : 'Install Node 22+:  brew install node   (or nodejs.org)',
  );
}

const git = tryRun('git --version');
if (git) ok(git.replace('git version', 'Git'));
else {
  bad('Git is not installed');
  problems.push(
    process.platform === 'win32'
      ? 'Install Git:  winget install Git.Git'
      : 'Install Git:  brew install git   (or xcode-select --install)',
  );
}

const gh = tryRun('gh --version');
if (gh) {
  ok(gh.split('\n')[0]);
  // Signed in matters only when they push; not being signed in is not a failure.
  if (tryRun('gh auth status')) ok('Signed in to GitHub');
  else warn('Not signed in to GitHub yet — run  gh auth login  when you want to push');
} else {
  warn('GitHub CLI not installed — optional, but it is what opens pull requests for you');
}

/* ---- 2. who you are, which the learnings need ----------------------------- */

head('Who you are');

let name = tryRun('git config user.name');
let email = tryRun('git config user.email');

if (!name) {
  const a = await ask('  Your name (goes on your commits and learnings): ');
  if (a) {
    execSync(`git config --global user.name ${JSON.stringify(a)}`);
    name = a;
  }
}
if (!email) {
  const a = await ask('  Your email: ');
  if (a) {
    execSync(`git config --global user.email ${JSON.stringify(a)}`);
    email = a;
  }
}

if (name) ok(`${name}${email ? ` <${email}>` : ''}`);
else {
  warn('No git identity set');
  problems.push('Set it:  git config --global user.name "Your Name"');
}
// Not cosmetic: .claude/learnings entries are attributed, and this is where
// the agent reads the name from rather than guessing it.
console.log(`  ${C.d}Used to sign your commits and to attribute anything you teach the agent.${C.x}`);

/* ---- 3. dependencies ------------------------------------------------------ */

if (!problems.length) {
  head('Installing dependencies');
  console.log(`  ${C.d}A few minutes the first time. Leave it running.${C.x}\n`);

  if (run('npm', ['ci'], root)) ok('XUI dependencies');
  else problems.push('npm ci failed in the XUI folder — send the output above to teja');

  // Chromium is what renders every story for the visual and behaviour tests.
  console.log('');
  if (run('npx', ['playwright', 'install', 'chromium'], root)) ok('Test browser');
  else warn('Playwright browser install failed — tests will not run until it does');
}

/* ---- 4. the playground, which is where you will actually build ------------ */

head('The playground');

if (fs.existsSync(playground)) {
  ok(`Found at ${playground}`);
  if (fs.existsSync(path.join(playground, 'package.json'))) {
    if (!fs.existsSync(path.join(playground, 'node_modules'))) {
      console.log('');
      if (run('npm', ['install'], playground)) ok('Playground dependencies');
      else warn('Playground install failed');
    } else ok('Playground dependencies already installed');
  }
} else {
  // It is a public repo, so stop telling people to go and ask for it.
  warn('Not found — cloning it');
  console.log('');
  const cloned = run(
    'git',
    ['clone', '--quiet', 'https://github.com/Chebrolu-Tejopriya/xui-playground.git', playground],
    path.resolve(root, '..'),
  );
  if (cloned) {
    ok('Cloned the Console');
    console.log('');
    if (run('npm', ['install'], playground)) ok('Playground dependencies');
    else warn('Playground install failed — run `npm install` in xui-playground');
  } else {
    warn('Could not clone it automatically');
    // The alias in the playground's vite config is `../xui`, so the two folders
    // are not independent - they have to be siblings or nothing resolves.
    console.log(`  ${C.d}The playground expects to sit NEXT TO this folder:${C.x}`);
    console.log(`  ${C.d}  <parent>/xui              <- you are here${C.x}`);
    console.log(`  ${C.d}  <parent>/xui-playground   <- and it goes here${C.x}`);
    console.log(`  ${C.d}It aliases @koinx/xui straight at this folder's source, so edits show${C.x}`);
    console.log(`  ${C.d}up live with no build step. Clone it yourself with:${C.x}`);
    console.log(`  ${C.d}  git clone https://github.com/Chebrolu-Tejopriya/xui-playground.git${C.x}`);
  }
}

/* ---- 5. tell the agent about XUI ------------------------------------------ */

head('Your AI assistant');

console.log(`  ${C.d}XUI ships an MCP server so the agent can read the system as tool calls${C.x}`);
console.log(`  ${C.d}instead of guessing at it. Add this to your MCP config:${C.x}\n`);
console.log(`    { "mcpServers": { "xui": { "command": "npx", "args": ["-y", "xui-mcp"] } } }\n`);
console.log(`  ${C.d}Then it can list components, look up props, search all 275 icons by${C.x}`);
console.log(`  ${C.d}meaning, and read what is still unsettled — rather than inventing any of it.${C.x}`);
console.log('');
console.log(`  ${C.d}For design-to-code, connect Figma too: open the Figma desktop app, then${C.x}`);
console.log(`  ${C.d}in Claude go to Settings → Connectors → Figma → Connect.${C.x}`);

/* ---- done ----------------------------------------------------------------- */

if (problems.length) {
  console.log(`\n${C.r}${C.b}  Setup stopped — ${problems.length} thing(s) need you first${C.x}\n`);
  for (const p of problems) console.log(`    ${p}`);
  console.log(`\n  Then run this again.\n`);
  process.exit(1);
}

console.log(`\n${C.g}${C.b}  Ready.${C.x}\n`);
console.log(`  Go back to your AI assistant and say:  ${C.b}"Setup is done, start the docs"${C.x}\n`);
console.log(`  ${C.d}Or, if you prefer typing it yourself:${C.x}`);
console.log(`  ${C.d}  npm run storybook        the component docs, on :6006${C.x}`);
console.log(`  ${C.d}  cd ../xui-playground && npm run dev    build a screen, on :5174${C.x}\n`);
