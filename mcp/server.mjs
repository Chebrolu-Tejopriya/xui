#!/usr/bin/env node
/**
 * XUI MCP server — the design system contract as tool calls.
 *
 * A CLAUDE.md that says "read the manifest" is a hope; an agent can skip it and
 * usually does. A tool cannot be skipped, because calling it is the only way to
 * get the content. That is the whole point of this file.
 *
 * Zero dependencies, deliberately. MCP over stdio is newline-delimited
 * JSON-RPC 2.0, which is little enough code that an SDK would cost more than it
 * saves — and it means this ships inside the package itself rather than as a
 * second thing a consumer has to install.
 *
 * Configure it (Claude Code, Cursor, Claude Desktop):
 *
 *   { "mcpServers": { "xui": { "command": "npx", "args": ["-y", "xui-mcp"] } } }
 *
 * or point straight at the file:
 *
 *   { "mcpServers": { "xui": { "command": "node", "args": ["<path>/mcp/server.mjs"] } } }
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => JSON.parse(fs.readFileSync(path.resolve(here, '..', f), 'utf8'));
const manifest = read('xui.manifest.json');
const rulebook = read('xui.rulebook.json');

const PKG = manifest.name;

// ---- tools -----------------------------------------------------------------

const TOOLS = [
  {
    name: 'list_xui_components',
    description:
      `List every component in the ${PKG} design system, with its import line. ` +
      'Call this FIRST when building any UI, before writing a component of your own — ' +
      'most things you need already exist here.',
    inputSchema: { type: 'object', properties: {} },
    run: () => {
      const byGroup = {};
      for (const [name, c] of Object.entries(manifest.components)) {
        (byGroup[c.group ?? 'Other'] ||= []).push(name);
      }
      const lines = Object.entries(byGroup)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([g, names]) => `${g}: ${names.join(', ')}`);
      return [
        `${Object.keys(manifest.components).length} components. Import all from '${PKG}'.`,
        '',
        ...lines,
        '',
        `${manifest.icons.count} icons across ${manifest.icons.categories.length} categories.`,
        `Icons: ${manifest.icons.usage}`,
        // Names, not just a count. Without these an agent guesses SearchIcon
        // or MoreIcon, which do not exist, and only finds out at typecheck.
        (manifest.icons.names ?? []).join(', '),
        '',
        'Call get_xui_component for props and rules before using one.',
      ].join('\n');
    },
  },
  {
    name: 'get_xui_component',
    description:
      'Full detail for one XUI component: its import, every prop with type and description, ' +
      'and the design rules governing it (sizes, spacing, states). Call before using a component.',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Component name, e.g. "Table" or "AppShell".' },
      },
      required: ['name'],
    },
    run: ({ name }) => {
      const key = Object.keys(manifest.components).find(
        (k) => k.toLowerCase() === String(name).toLowerCase(),
      );
      if (!key) {
        return `No component named "${name}". Available: ${Object.keys(manifest.components).join(', ')}`;
      }
      const c = manifest.components[key];
      const out = [`# ${key}`, '', c.import, ''];
      if (c.extends) out.push(`Also accepts: ${c.extends}`, '');
      if (c.props?.length) {
        out.push('## Props');
        for (const p of c.props) {
          out.push(
            `- ${p.name}${p.required ? ' (required)' : ''}: ${p.type}` +
              (p.description ? ` — ${p.description}` : ''),
          );
        }
        out.push('');
      } else {
        out.push('No props beyond the standard HTML attributes.', '');
      }
      const rules = manifest.componentRules?.[key] ?? manifest.componentRules?.[c.group];
      if (rules) {
        out.push('## Design rules (from Figma — follow exactly)');
        for (const r of [].concat(rules)) out.push(`- ${r}`);
      }
      return out.join('\n');
    },
  },
  {
    name: 'get_xui_tokens',
    description:
      'XUI design tokens and — more importantly — WHICH token to use for a given situation ' +
      '(page background, card, hovered row, disabled fill). Call this instead of choosing a colour, ' +
      'and never write a raw hex. Optionally pass a hex to resolve it to the token that replaces it.',
    inputSchema: {
      type: 'object',
      properties: {
        category: {
          type: 'string',
          description: 'Optional filter: surface, content, border, spacing, radius, type.',
        },
        hex: {
          type: 'string',
          description: 'Optional hex like "#f1f5f9" to resolve to its semantic token.',
        },
      },
    },
    run: ({ category, hex }) => {
      const out = [];
      if (hex) {
        const norm = String(hex).trim().toLowerCase().slice(0, 7);
        const prim =
          rulebook.reverse.hexToPrimitive.light[norm] ?? rulebook.reverse.hexToPrimitive.dark[norm];
        if (!prim) {
          out.push(`${norm} is not a colour in this design system. Do not use it.`, '');
        } else {
          const semantics = prim.flatMap((p) => rulebook.reverse.primitiveToSemantics[p] ?? []);
          out.push(
            `${norm} is the primitive ${prim.join(', ')}.`,
            semantics.length
              ? `Use one of these semantic tokens instead: ${[...new Set(semantics)]
                  .map((s) => `var(--${s})`)
                  .join(', ')}`
              : 'No semantic token maps to it — it should not appear in product code.',
            '',
          );
        }
      }
      out.push('## Which token when', '');
      for (const [situation, token] of Object.entries(manifest.tokenUsage ?? {})) {
        if (category && !token.includes(category) && !situation.includes(category)) continue;
        out.push(`- ${situation} → var(--${token})`);
      }
      out.push('', '## All tokens', '');
      for (const [group, names] of Object.entries(manifest.tokens ?? {})) {
        if (category && group !== category) continue;
        out.push(`${group}: ${[].concat(names).join(', ')}`);
      }
      out.push('', manifest.usage.tokens, manifest.usage.theming);
      return out.join('\n');
    },
  },
  {
    name: 'get_xui_guidelines',
    description:
      'The rules XUI is built on: principles, layout patterns for common screens, which ' +
      'component to choose when two look alike, and the anti-patterns that break dark mode ' +
      'or drift from Figma. Read before composing a screen.',
    inputSchema: { type: 'object', properties: {} },
    run: () => {
      const out = [`# ${PKG} — how to build with it`, '', '## Principles'];
      for (const p of manifest.principles ?? []) out.push(`- ${p}`);
      out.push('', '## Layout patterns');
      for (const [k, v] of Object.entries(manifest.layoutPatterns ?? {})) out.push(`- ${k}: ${v}`);
      // Several components look alike in a Figma frame and behave differently in
      // a browser. Picking the wrong one is not caught by any other gate here.
      out.push('', '## Choosing between components that look alike');
      for (const [k, v] of Object.entries(manifest.choosing ?? {})) out.push(`- **${k}** — ${v}`);
      out.push('', '## Anti-patterns — do NOT do these');
      for (const a of manifest.antiPatterns ?? []) out.push(`- ${a}`);
      return out.join('\n');
    },
  },
];

// ---- JSON-RPC over stdio ---------------------------------------------------

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
const reply = (id, result) => send({ jsonrpc: '2.0', id, result });
const fail = (id, code, message) => send({ jsonrpc: '2.0', id, error: { code, message } });

function handle(req) {
  const { id, method, params } = req;
  // Notifications carry no id and must never be answered.
  if (id === undefined) return;

  switch (method) {
    case 'initialize':
      return reply(id, {
        // Echo the client's version when it offers one; it knows better than we do.
        protocolVersion: params?.protocolVersion ?? '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'xui', version: manifest.version },
      });
    case 'ping':
      return reply(id, {});
    case 'tools/list':
      return reply(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
        })),
      });
    case 'tools/call': {
      const tool = TOOLS.find((t) => t.name === params?.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${params?.name}`);
      try {
        return reply(id, { content: [{ type: 'text', text: tool.run(params.arguments ?? {}) }] });
      } catch (err) {
        return reply(id, {
          content: [{ type: 'text', text: `Error: ${err.message}` }],
          isError: true,
        });
      }
    }
    default:
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

let buffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    try {
      handle(JSON.parse(line));
    } catch {
      fail(null, -32700, 'Parse error');
    }
  }
});
