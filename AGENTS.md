# Windwords — agent entry point

Read this file, the assigned GitHub ticket and its linked area guide. Do not load
chat history, every skill, all assets or the entire repository by default.

- Product: Pip’s English, usually teacher-directed classroom play. Learning is the
  default; Classic is optional adventure. Preserve the 496 stable picture IDs and
  bare-word homograph acceptance unless a ticket explicitly changes the contract.
- Source: this checkout; origin HappyClass-ops/windwords; main deploys Pages at
  https://happyclass-ops.github.io/windwords/. Other dated checkouts are backups.
- Start: git status; read docs/STATUS.md (dated snapshot), then the exact ticket.
  GitHub is authoritative for ticket state. Claim before editing; one writer per
  branch. Never assume an old “in-progress” label means an agent is still running.
- User permits ordinary technical decisions, requested fixes, tests and publishing.
  Ask for extra paid usage unless explicitly authorized for the current request;
  never generate images without approval. Destructive operations or material scope
  changes still need approval. Tool/environment permissions always take precedence.
- Keep changes ticket-scoped. Prefer a small useful module over a framework. Do not
  split code just to increase file count. No framework migration for this game.
- Use targeted tests during implementation; one npm test before a release. Tests
  must not call paid speech/image services. See docs/agents/workflow.md for commands.
- Close only with acceptance evidence and commit; distinguish implemented, tested,
  pushed and deployed. If interrupted, update the ticket with exact resume state.
- Escalate after two failed falsifiable hypotheses or a substantial teaching/state/
  security decision. Supply the reproduction and options, not a context dump.
  Model routing is guidance, not an assumption that another model/tool is available.

## Agent skills

Issue tracker: GitHub; docs/agents/issue-tracker.md. Triage vocabulary:
docs/agents/triage-labels.md. Domain glossary: CONTEXT.md; read only relevant ADRs.
Area routing: docs/CODE-MAP.md. Optional portable skill: .agents/skills/pip-ticket.
CLAUDE.md only points here; do not maintain competing instruction copies.

