# Contributing to Millhouse Web

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `bun install`
3. Setup Convex: `npx convex dev`
4. Start dev server: `bun run dev`

## Branch Naming

- `phase-N/feature-name` - Phase work
- `fix/description` - Bug fixes
- `chore/description` - Maintenance

## Commit Messages

Use conventional commits:

```
feat: add user authentication
fix: resolve login redirect issue
chore: update dependencies
docs: add API documentation
refactor: simplify auth flow
test: add login tests
```

## Pull Requests

1. Create branch from `main`
2. Make changes with tests
3. Run quality checks:
   ```bash
   bun run lint
   bun run typecheck
   bun run test
   bun run build
   ```
4. Create PR with description
5. Wait for review

## Code Style

- TypeScript strict mode
- Biome for formatting/linting
- shadcn/ui for components
- Server Components by default

## Testing

- Unit tests: `bun run test`
- E2E tests: `bun run test:e2e`
- Write tests for Convex functions
- E2E for critical user flows

## Questions

Open an issue for questions or suggestions.
