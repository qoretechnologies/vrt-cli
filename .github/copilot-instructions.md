# Project Overview: Qlip

**Qlip** (`@qoretechnologies/qlip`) is a specialized Storybook screenshot capture tool designed as a Vitest addon plugin for automated visual regression testing. It captures screenshots of Storybook stories during test execution and organizes them with metadata for downstream analysis and comparison.

## What We're Building

A production-ready screenshot automation tool that integrates seamlessly with the Vitest + Storybook testing workflow, providing:

**Core Capabilities:**
- **Automatic Screenshots** - Captured after every story test completes
- **Manual Screenshots** - On-demand capture via `screenshot()` function in play functions
- **Error Screenshots** - Automatic capture when tests fail (configurable per story)

**Key Features:**
- **Animation Control** - Disable or pause CSS animations before capture to ensure consistent screenshots
- **DOM Idle Waiting** - Waits for DOM mutations to settle (handles react-spring and other animation libraries)
- **Element Masking** - CSS selector-based masking with `ignoreElements` to hide dynamic content (timestamps, ads, etc.)
- **Viewport Control** - Customizable viewport sizes per story or globally
- **Intelligent Option Resolution** - Three-tier precedence (explicit options → story parameters → plugin defaults)
- **Organized Output** - Timestamped build IDs with separate directories for auto/manual/error captures
- **Comprehensive Manifest** - JSON manifest with stats, metadata, and timing for each screenshot

**Architecture:**
- `/src/plugin/` - Vitest plugin integration
- `/src/runtime/` - Screenshot capture, setup hooks, and state management
- `/src/fs/` - File system operations and output organization
- `/src/config/` - Configuration resolution logic
- `/src/types.ts` - TypeScript definitions

**Tech Stack:**
- Vitest 4.x + Playwright for browser automation
- Storybook 10.x for component documentation
- TypeScript with strict typing
- React 19.x for demo components

**Output Structure:**
```
./qlip/screenshots/<buildId>/stories/
  ├── auto/<storyTitle>--<storyName>.png
  ├── manual/<storyTitle>--<storyName>--<screenshotName>.png
  ├── error/<storyTitle>--<storyName>--qlip-auto-error-capture.png
  └── manifest.json
```

---

# General

- Focus is first on user experience and performance, complexity and tech debt secondary
- Follow existing code patterns for new components; refer to similar components for guidance
- Check if a helper or utility already exists before writing a new one

# TypeScript

- Use TypeScript with strict typing; define prop interfaces for each component with `I` prefix for interfaces and `T` prefix for types

# UI / UX

- Always make sure to create reusable components
- Always use named exports for React components
- There can be multiple React components in one file if it makes sense
- Use styled-components for styling; define style interfaces for styled components
- Always componentize styles with styled-components; avoid inline styles
- Use functional components with React hooks
- For React, always wrap components in `memo()` unless there's a specific reason not to
- For React, always wrap callbacks in `useCallback()` unless there's a specific reason not to
- For React, always memoize computed values in `useMemo()` unless there's a specific reason not to

# Testing

- Run tests after changes, run `yarn precheck` after feature completions
- Write a unit test if it makes sense for the change you have made, but Storybook tests will always have higher priority

### Architecture and key surfaces

- Always put a new line before return
- Never use single-line if statements without curly braces
