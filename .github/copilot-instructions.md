You are building a brand-new TypeScript Node.js CLI tool in its own repo and publishable npm package. The tool captures screenshots for every Storybook story from a locally running Storybook instance (Chrome-family via Playwright Chromium). This is Phase 1 of a Chromatic/Percy competitor, but cloud/diffing are out of scope. Local-only.

# CONSTRAINTS:

- Local-first. No backend, no auth, no upload.
- Must work on macOS/Linux.
- Use Playwright with chromium.launch() (no need to force real Chrome channel yet).
- Do not depend on Loki.
- Handle Storybook 6/7/8 reasonably via endpoint fallbacks (see below).
- Avoid flaky screenshot assertions in unit tests; focus on deterministic unit tests for discovery/parsing/URL building/path building/manifest generation and use an optional integration test that can be skipped unless explicitly enabled.

# TESTING REQUIREMENTS:

- Use Vitest for unit tests.
- 90%+ coverage on non-Playwright logic.
- Write thorough tests for

# DOCS:

- Update README if you make a change that would require user documentation.

# General

- Focus is first on user experience and performance, complexity and tech debt secondary
- Follow existing code patterns for new components; refer to similar components for guidance
- Check if a helper or utility already exists before writing a new one

# TypeScript

- Use TypeScript with strict typing; define prop interfaces for each component with `I` prefix for interfaces and `T` prefix for types

### Architecture and key surfaces

- Always put a new line before return
- Never use single-line if statements without curly braces
- Prefer early returns to reduce nesting
- Prefer `const` over `let` unless reassignment is needed
- Use async/await for asynchronous code; avoid mixing with .then()/.catch()
- Use template literals for string concatenation
