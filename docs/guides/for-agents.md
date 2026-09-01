# For agents

### For agents

XUI ships an **MCP server**, so the design system is a set of tool calls rather
than a document an agent may or may not open. Point your editor at it:

```json
{ "mcpServers": { "xui": { "command": "npx", "args": ["-y", "xui-mcp"] } } }
```

Four tools:

| Tool | Returns |
|---|---|
| `list_xui_components` | All 38 components and their imports — call before building anything |
| `get_xui_component` | One component: every prop, and its design rules from Figma |
| `get_xui_tokens` | Which token for which situation, and hex → token resolution |
| `get_xui_guidelines` | Principles, layout patterns, and anti-patterns to avoid |

It has **no dependencies** and reads the same generated contract the linter and
the Figma plugin do, so it cannot drift from the code.

The raw contract is also importable if you would rather read it directly:

```js
import manifest from '@koinx/xui/manifest';  // components, props, rules
import rulebook from '@koinx/xui/rulebook';  // tokens, and hex -> token
```
