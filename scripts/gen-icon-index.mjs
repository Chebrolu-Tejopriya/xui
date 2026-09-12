// Builds xui.icons.json — every icon in XUI, searchable by what it MEANS.
//
// WHY. The manifest lists 69 Icons v2 and 48 coin badges. It has never listed
// the 158 general icons or the trade-type set, so roughly two thirds of the
// icons in this system are invisible to anything reading the contract — the MCP
// server included. An agent asked for a "file" icon finds nothing, concludes
// XUI has none, and draws one. That is not hypothetical: five component stories
// shipped hand-drawn <svg>s, and one row of them was ragged enough that a human
// caught it by eye after ten automated gates passed. check-story-icons.mjs now
// blocks the drawing. This file supplies the thing to reach for instead.
//
// Names alone are not enough to search. Nobody types "ActionsIcon" looking for a
// kebab menu, and our names are Figma's layer names, which are inconsistent by
// inheritance — MoreVertIcon and ActionsIcon are the same idea. So each entry
// carries `terms`: the words split out of its own name, plus curated synonyms.
//
// SYNONYMS is hand-kept and would rot silently, so it does not get to. Every key
// must match an icon that exists at generate time or this script throws — a
// rename breaks the build instead of quietly deleting the only word anyone would
// have searched for.
//
//   node scripts/gen-icon-index.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const pkg = JSON.parse(read('package.json')).name;

/* ---- the four families ---------------------------------------------------- */

const v2Src = read('src/icons/icons.tsx');
const generalSrc = read('src/icons/general-icons.tsx');
const coinSrc = read('src/icons/coin-icons.tsx');

const v2 = [...v2Src.matchAll(/export const (\w+Icon) = createIcon/g)].map((m) => m[1]);
const general = [...generalSrc.matchAll(/export const (\w+Icon) = \/\*#__PURE__\*\/ createGeneralIcon/g)].map((m) => m[1]);
const coin = [...coinSrc.matchAll(/^export const (\w+Coin\d*) =/gm)].map((m) => m[1]);
const tradeBlock = generalSrc.match(/export const tradeTypeIconNames = \[([\s\S]*?)\]/);
const trade = tradeBlock ? [...tradeBlock[1].matchAll(/"(\w+)"/g)].map((m) => m[1]) : [];

for (const [label, list] of [['Icons v2', v2], ['general', general], ['coin', coin]]) {
  if (!list.length) throw new Error(`no ${label} icons found — run the generators first (npm run ds:build)`);
}

const FAMILIES = {
  v2: {
    label: 'Icons v2',
    note: 'The primary set. Four tones (outlined/solid/dualtone/dualtone-selected), renders in currentColor, follows the theme. Reach for these first.',
    usage: (n) => `<${n} variant="outlined" size={20} />`,
  },
  general: {
    label: 'General icons',
    note: 'The Figma "Icon Library". Single-tone, currentColor, follows the theme. Use when Icons v2 has no equivalent.',
    usage: (n) => `<${n} size={20} />`,
  },
  trade: {
    label: 'Trade type icons',
    note: 'The six trade-type glyphs. Same components as the general icons, grouped because Figma groups them.',
    usage: (n) => `<${n} size={20} />`,
  },
  coin: {
    label: 'Coin icons',
    note: 'Transaction-type BADGES, not general-purpose icons. Fixed raw-hex palette that does NOT follow the theme; they take `size` but ignore `color`.',
    usage: (n) => `<${n} size={32} />`,
  },
};

/* ---- synonyms -------------------------------------------------------------- */

/**
 * Words a person would search that the icon's own name does not contain.
 * Keys are export names; every one is checked to exist below.
 *
 * Only add a synonym that a reasonable search would actually use. Padding this
 * with near-misses makes every query return everything, which is the same as
 * returning nothing.
 */
const SYNONYMS = {
  // v2 — the set an agent reaches for most, so the most worth covering
  SettingsIcon: ['gear', 'cog', 'preferences', 'config', 'options'],
  UserIcon: ['person', 'profile', 'account', 'avatar', 'member'],
  AddUserIcon: ['invite', 'add person', 'new member', 'signup'],
  UserGroupIcon: ['team', 'people', 'members', 'group', 'organisation'],
  DeleteIcon: ['trash', 'bin', 'remove', 'discard'],
  EditIcon: ['pencil', 'write', 'modify', 'rename', 'change'],
  ActionsIcon: ['kebab', 'more', 'overflow', 'three dots', 'menu'],
  Actions1Icon: ['kebab', 'more', 'overflow', 'dots'],
  ReportsIcon: ['document', 'file', 'paper', 'statement'],
  GenerateReportIcon: ['export report', 'create document', 'statement'],
  JournalIcon: ['ledger', 'log', 'book', 'diary'],
  TransactionsIcon: ['txn', 'activity', 'history', 'ledger'],
  WalletIcon: ['purse', 'account', 'balance', 'funds'],
  TaxesIcon: ['tax', 'filing', 'itr', 'compliance'],
  CashIcon: ['money', 'currency', 'note', 'payment'],
  MoneyBagIcon: ['funds', 'earnings', 'payout', 'revenue'],
  CoinsIcon: ['tokens', 'crypto', 'currency', 'assets'],
  SwapIcon: ['exchange', 'trade', 'convert', 'switch'],
  NotificationIcon: ['bell', 'alert', 'reminder'],
  NotificationDotIcon: ['bell unread', 'alert badge', 'unread'],
  EmailIcon: ['mail', 'envelope', 'message', 'contact'],
  CallIcon: ['phone', 'telephone', 'contact', 'dial'],
  BubbleIcon: ['chat', 'comment', 'message', 'support'],
  HelpdeskIcon: ['support', 'help', 'faq', 'assistance'],
  LockedIcon: ['secure', 'private', 'password', 'protected'],
  UnlockedIcon: ['insecure', 'open', 'public', 'unprotected'],
  SpamIcon: ['junk', 'flag', 'report', 'suspicious'],
  VerifiedIcon: ['verified', 'trusted', 'badge', 'approved', 'certified'],
  TickCircleIcon: ['success', 'done', 'complete', 'confirmed', 'ok'],
  CloseCircleIcon: ['fail', 'error', 'cancel', 'rejected'],
  WarningAlertIcon: ['caution', 'attention', 'risk', 'warning'],
  InfoIcon: ['information', 'about', 'details', 'note'],
  BarChartIcon: ['graph', 'analytics', 'statistics', 'data'],
  GraphIcon: ['chart', 'analytics', 'trend', 'data'],
  InsightsIcon: ['analytics', 'trends', 'intelligence'],
  CalculatorIcon: ['compute', 'maths', 'sum', 'estimate'],
  CalendarIcon: ['date', 'schedule', 'when', 'day'],
  SyncIcon: ['refresh', 'reload', 'update', 'retry'],
  CopyIcon: ['duplicate', 'clipboard'],
  DownloadIcon: ['save', 'export', 'get'],
  AddPlusIcon: ['plus', 'new', 'create', 'add'],
  RemoveMinusIcon: ['minus', 'subtract', 'less'],
  CloseIcon: ['x', 'dismiss', 'cancel', 'exit'],
  CheckIcon: ['tick', 'done', 'yes', 'confirm'],
  LabelIcon: ['tag', 'category', 'chip'],
  MergeIcon: ['combine', 'join', 'consolidate'],
  ToolsIcon: ['maintenance', 'utilities', 'wrench', 'repair'],
  ComputerIcon: ['desktop', 'device', 'monitor', 'screen'],
  DayIcon: ['light mode', 'sun', 'bright'],
  NightIcon: ['dark mode', 'moon'],
  OverviewIcon: ['dashboard', 'home', 'summary'],
  PortfolioIcon: ['holdings', 'assets', 'investments'],
  ExploreIcon: ['discover', 'browse', 'search'],
  ResourcesIcon: ['library', 'docs', 'learn'],
  RulesIcon: ['policy', 'conditions', 'logic'],
  ItemsIcon: ['list', 'entries', 'records'],
  GuideListIcon: ['checklist', 'steps', 'instructions'],
  PurchasesIcon: ['buy', 'orders', 'bought'],
  PercentageIcon: ['percent', 'rate', 'yield'],
  ReferEarnIcon: ['referral', 'invite', 'rewards'],
  AddWalletIcon: ['connect wallet', 'link account', 'new wallet'],

  // general — only where the Figma layer name hides the meaning
  MoreVertIcon: ['kebab', 'overflow', 'three dots', 'actions', 'menu'],
  MoreHorizIcon: ['ellipsis', 'overflow', 'three dots', 'actions'],
  FolderIcon: ['directory', 'group', 'category'],
  FolderOpenIcon: ['directory open', 'expanded folder'],
  FolderClosedIcon: ['directory closed', 'collapsed folder'],
  ProfileIcon: ['user', 'person', 'account', 'avatar'],
  InviteUserIcon: ['add person', 'invite', 'share access'],
  AttachFileIcon: ['paperclip', 'attachment', 'upload'],
  UploadFileIcon: ['import', 'attach', 'send file'],
  FileCopyIcon: ['duplicate file', 'copy document'],
  FileDownloadIcon: ['export file', 'save document'],
  ContentCopyIcon: ['copy', 'duplicate', 'clipboard'],
  CopyAllIcon: ['copy everything', 'duplicate all'],
  ExpandMoreIcon: ['chevron down', 'dropdown', 'open', 'more'],
  MenuIcon: ['hamburger', 'nav', 'navigation', 'sidebar'],
  TimeIcon: ['clock', 'duration', 'when'],
  AccessTimeIcon: ['clock', 'recent', 'history', 'duration'],
  CancelIcon: ['close', 'x', 'dismiss', 'remove'],
  SkippedIcon: ['skip', 'ignored', 'passed over'],
  DepositIcon: ['incoming', 'received', 'credit', 'in'],
  WithdrawalIcon: ['outgoing', 'sent', 'debit', 'out'],
  AccountBalanceWalletIcon: ['balance', 'wallet', 'funds'],
  SettingsGeneralIcon: ['gear', 'cog', 'preferences', 'config'],
  EditGeneralIcon: ['pencil', 'write', 'modify'],
};

/* ---- build ---------------------------------------------------------------- */

/** "AccountBalanceWalletIcon" -> ["account","balance","wallet"] */
function words(name) {
  return name
    .replace(/(Icon|Coin)\d*$/, '')
    .replace(/GeneralIcon$/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

const icons = [];
const push = (family, names) => {
  for (const name of names) {
    const terms = new Set(words(name));
    for (const s of SYNONYMS[name] ?? []) for (const w of s.split(/\s+/)) terms.add(w.toLowerCase());
    icons.push({
      name,
      family,
      import: `import { ${name} } from '${pkg}';`,
      usage: FAMILIES[family].usage(name),
      terms: [...terms].sort(),
      synonyms: SYNONYMS[name] ?? [],
    });
  }
};

push('v2', v2);
// A trade-type icon is also a general icon; list it once, under the family that
// says more about it.
const tradeSet = new Set(trade);
push('general', general.filter((n) => !tradeSet.has(n)));
push('trade', general.filter((n) => tradeSet.has(n)));
push('coin', coin);

// A synonym pointing at an icon that no longer exists is worse than no synonym:
// the word it was carrying is gone and nothing says so.
const known = new Set(icons.map((i) => i.name));
const stale = Object.keys(SYNONYMS).filter((n) => !known.has(n));
if (stale.length) {
  throw new Error(
    `SYNONYMS names ${stale.length} icon(s) that do not exist: ${stale.join(', ')}\n` +
      `They were renamed or removed. Update SYNONYMS in scripts/gen-icon-index.mjs — ` +
      `silently dropping them loses the only word anyone would have searched for.`,
  );
}

/**
 * Icons whose bare name is shared across families. Figma reuses names for
 * different drawings, and code disambiguates with a GeneralIcon suffix or a
 * numeric one — so a search for "ArrowForward" has to say that there are two
 * and they are not the same glyph.
 */
const collisions = {};
for (const icon of icons) {
  const stem = icon.name.replace(/(General)?(Icon|Coin)\d*$/, '');
  (collisions[stem] ??= []).push(icon.name);
}
for (const [stem, names] of Object.entries(collisions)) {
  if (names.length < 2) delete collisions[stem];
}

const out = {
  $comment:
    'AUTO-GENERATED by scripts/gen-icon-index.mjs. Every icon in XUI, searchable by meaning. ' +
    'Read by the find_xui_icon MCP tool and scripts/find-icon.mjs. Do not edit by hand.',
  generated: new Date().toISOString().slice(0, 10),
  package: pkg,
  count: icons.length,
  families: Object.fromEntries(Object.entries(FAMILIES).map(([k, v]) => [k, { label: v.label, note: v.note }])),
  collisions,
  icons,
};

const file = path.join(root, 'xui.icons.json');
fs.writeFileSync(file, JSON.stringify(out, null, 2) + '\n');

const per = Object.keys(FAMILIES).map((f) => `${icons.filter((i) => i.family === f).length} ${f}`);
console.log(`icon index: ${icons.length} icons (${per.join(', ')}) -> ${path.relative(root, file)}`);
console.log(`  ${Object.keys(SYNONYMS).length} with synonyms, ${Object.keys(collisions).length} name collisions flagged`);
