export default {
  // Repository information
  repo: {
    provider: 'github',
    repo: 'danlourenco/moma-2025',
    domain: 'github.com'
  },

  // Changelog generation
  output: 'CHANGELOG.md',
  
  // Release configuration
  release: {
    commit: true,
    tag: true,
    push: true
  },

  // Conventional commit types
  types: {
    feat: { title: '🚀 Features' },
    fix: { title: '🐛 Bug Fixes' },
    docs: { title: '📖 Documentation' },
    style: { title: '💅 Styles' },
    refactor: { title: '♻️  Refactoring' },
    perf: { title: '⚡ Performance' },
    test: { title: '🧪 Tests' },
    build: { title: '🏗️  Build System' },
    ci: { title: '🤖 CI/CD' },
    chore: { title: '🧹 Chores' }
  },

  // Version bumping rules for pre-1.0.0 versions
  // In 0.x.x versions:
  // - feat: bumps minor (0.1.0 → 0.2.0)
  // - fix: bumps patch (0.1.0 → 0.1.1)
  // - BREAKING CHANGE: bumps minor (0.1.0 → 0.2.0)
  // After 1.0.0:
  // - feat: bumps minor (1.0.0 → 1.1.0)  
  // - fix: bumps patch (1.0.0 → 1.0.1)
  // - BREAKING CHANGE: bumps major (1.0.0 → 2.0.0)
  
  // Exclude certain commit types from changelog
  exclude: {
    types: ['chore', 'ci']
  },

  // Group commits by scope
  group: true,

  // Show commit authors
  showAuthor: true
}