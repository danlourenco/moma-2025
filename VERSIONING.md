# Semantic Versioning Workflow

This project uses [changelogen](https://github.com/unjs/changelogen) for automated changelog generation and semantic versioning.

## Commands

### Generate Changelog
```bash
npm run changelog
```
Generates `CHANGELOG.md` from conventional commits since last version.

### Version Bumping
```bash
# Patch version (0.1.0 → 0.1.1) - for bug fixes
npm run version:patch

# Minor version (0.1.0 → 0.2.0) - for new features  
npm run version:minor

# Major version (0.1.0 → 1.0.0) - for breaking changes
npm run version:major
```

### Release
```bash
npm run release
```
Bumps version, generates changelog, creates git tag, and pushes to remote.

## Semantic Versioning Rules

### Pre-1.0.0 Versions (Current: 0.x.x)
- `fix:` commits → **patch** version bump (0.1.0 → 0.1.1)
- `feat:` commits → **minor** version bump (0.1.0 → 0.2.0)  
- `BREAKING CHANGE:` → **minor** version bump (0.1.0 → 0.2.0)

### Post-1.0.0 Versions (Future: 1.x.x+)
- `fix:` commits → **patch** version bump (1.0.0 → 1.0.1)
- `feat:` commits → **minor** version bump (1.0.0 → 1.1.0)
- `BREAKING CHANGE:` → **major** version bump (1.0.0 → 2.0.0)

## Conventional Commit Types

| Type | Description | Version Bump | Changelog Section |
|------|-------------|-------------|------------------|
| `feat` | New features | minor/patch | 🚀 Features |
| `fix` | Bug fixes | patch | 🐛 Bug Fixes |
| `docs` | Documentation | patch | 📖 Documentation |
| `style` | Code style changes | patch | 💅 Styles |
| `refactor` | Code refactoring | patch | ♻️ Refactoring |
| `perf` | Performance improvements | patch | ⚡ Performance |
| `test` | Tests | patch | 🧪 Tests |
| `build` | Build system changes | patch | 🏗️ Build System |
| `ci` | CI/CD changes | patch | 🤖 CI/CD |
| `chore` | Maintenance tasks | patch | (excluded) |

## Workflow Examples

### Feature Release
```bash
# After completing a feature with conventional commits
npm run version:minor
# This will:
# 1. Generate changelog from commits
# 2. Bump minor version in package.json
# 3. Create git tag
# 4. Commit and push changes
```

### Bug Fix Release
```bash
# After fixing bugs with conventional commits
npm run version:patch
```

### Major Release (Breaking Changes)
```bash
# When ready to release breaking changes
npm run version:major
```

## Current Version Strategy

We're currently in **v0.1.0** (Phase 1 of development). Version progression plan:

- `v0.1.0` → Phase 1 complete (auth system)
- `v0.2.0` → Phase 2 complete (artwork upload)  
- `v0.3.0` → Phase 3 complete (exhibits)
- `v0.4.0` → Phase 4 complete (public gallery)
- `v1.0.0` → Production ready! 🚀

## Manual Override

If you need to manually set a version:
```bash
# Edit package.json version field directly, then:
npm run changelog
git add .
git commit -m "chore: release v0.2.0"
git tag v0.2.0
git push && git push --tags
```