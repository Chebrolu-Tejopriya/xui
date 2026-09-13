<!--
  Claude Code reads CLAUDE.md, never AGENTS.md. This one line makes it read the
  same instructions Cursor and Codex already get, so there is one file to keep
  current and no copy to drift. Edit AGENTS.md, not this.

  If this file ever says "You are an assistant for the Jetro research platform",
  the Jetro VS Code extension is installed again and has overwritten it — it
  rewrites CLAUDE.md, .mcp.json and .cursor/mcp.json on every start. Uninstall
  it and `git checkout` these files. CI refuses a commit that carries Jetro's.
-->
@AGENTS.md
