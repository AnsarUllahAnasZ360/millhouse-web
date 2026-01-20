# Git Workflow Skill

## Triggers
- commit, PR, branch, git, merge, rebase

## Conventions

### Branch Naming
- `phase-N/feature-name` for phase work
- `fix/description` for bug fixes
- `chore/description` for maintenance

### Commit Messages
Use conventional commits:
- `feat:` new features
- `fix:` bug fixes
- `chore:` maintenance tasks
- `docs:` documentation changes
- `refactor:` code refactoring
- `test:` test additions/changes

### Pull Requests
- Create PR with clear title
- Include summary of changes
- Add test plan checklist
- Link related issues

### Commands
```bash
# Create feature branch
git checkout -b phase-N/feature-name

# Commit with conventional format
git commit -m "feat: add user authentication"

# Push and create PR
git push -u origin HEAD
gh pr create --title "feat: add user authentication" --body "## Summary\n- Added login flow\n\n## Test plan\n- [ ] Test login\n- [ ] Test logout"
```

### Rules
- Never force push to main
- Always create PRs for main branch
- Squash commits on merge
- Delete branches after merge
