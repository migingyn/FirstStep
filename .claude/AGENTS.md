# Global Codex defaults

## Working style
- Make the smallest correct change first.
- Preserve existing architecture unless I explicitly ask for a refactor.
- Do not rewrite unrelated files.
- Prefer reusable helpers over duplicated logic.
- Keep TypeScript strict and avoid `any` unless unavoidable.

## Communication
- Start by listing the files you plan to inspect.
- State assumptions clearly instead of hiding them.
- When a task is large, break the work into small phases.
- Summarize changed files and verification steps at the end.

## Code quality
- Match the repository's existing style and patterns.
- Add comments only where logic is non-obvious.
- Avoid introducing new dependencies unless necessary.
- Prefer clear names over clever abstractions.

## Safety
- Never delete large sections of code without explaining why.
- Ask before making destructive or irreversible changes.
- If credentials or secrets are needed, use placeholder env values.

## Validation
- Run the smallest relevant tests first.
- If tests cannot be run, say so explicitly.
- Include a brief manual verification checklist.<!--  -->