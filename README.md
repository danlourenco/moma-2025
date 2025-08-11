# MoMA (Museum of Munchkin Art) - Museum Platform as a Service

> **AI-powered art gallery platform for families and creators**

Transform your family's artwork into a sophisticated digital museum with AI-generated critiques and social discovery features.

## 🎯 Project Vision

**From Personal Gallery to Platform:** Originally created as a personal AI-assisted art gallery for children's artwork, MoMA 2025 is evolving into a multi-user "DeviantArt for families" - a platform where anyone can create accounts, organize artwork into themed exhibits, and discover art from other families.

## ✨ Key Features

- 🎨 **Exhibit Creation**: Organize artworks into themed collections
- 🤖 **AI Art Critiques**: Streaming AI-generated descriptions with typewriter effects
- 👥 **Multi-User Platform**: Account creation and personal galleries
- 📱 **Mobile-First**: Optimized for phone photography workflows
- 🌐 **Social Discovery**: Public galleries, search, and featured exhibits
- 🔗 **Shareable**: Beautiful exhibit URLs for social media

## 🏗️ Tech Stack

- **Framework**: [Nuxt 4.x](https://nuxt.com/) with TypeScript
- **Platform**: [NuxtHub](https://hub.nuxt.com/) on Cloudflare Pages
- **Database**: Cloudflare D1 (SQLite)
- **Storage**: Cloudflare R2 (S3-compatible)
- **AI**: Cloudflare Workers AI
- **Auth**: Better Auth with Google/GitHub OAuth
- **Styling**: TailwindCSS
- **Development**: Git-first with conventional commits

## 🚀 Development Setup

### Prerequisites

- Node.js 18+ 
- npm/pnpm/yarn
- Git

### Installation

1. **Clone and install dependencies:**
   ```bash
   git clone https://github.com/danlourenco/moma-2025.git
   cd moma-2025
   npm install
   ```

2. **Link to NuxtHub project** (enables AI features):
   ```bash
   npx nuxthub link
   ```
   Follow the prompts to create/connect to a Cloudflare project.

3. **Start development server:**
   ```bash
   npm run dev
   ```
   Opens on `http://localhost:3000` (or next available port)

### Environment Setup

The project uses environment-aware configuration:
- **Development**: Local storage in `.data/hub`
- **Production**: Cloudflare infrastructure
- **AI Features**: Available after linking to NuxtHub project

## 📊 Development Phases

### ✅ Phase 1: Foundation (Completed)
- [x] Modern NuxtHub project setup
- [x] Cloudflare integration
- [x] Git repository with conventional commits

### 🚧 Phase 2: Core Features (In Progress)  
- [ ] Better Auth implementation
- [ ] Artwork upload with validation
- [ ] Streaming AI description generation
- [ ] Basic CRUD operations

### 📋 Phase 3: Exhibit Management
- [ ] Exhibit builder interface
- [ ] Drag-and-drop organization
- [ ] Public/private settings

### 📋 Phase 4: Public Gallery
- [ ] Browse and discovery
- [ ] Search and filtering
- [ ] Social features (likes, shares)

### 📋 Phase 5: Advanced Features
- [ ] Audio narration (AI text-to-speech)
- [ ] Mobile PWA capabilities
- [ ] Admin dashboard

## 🔧 Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# NuxtHub Commands
npx nuxthub link     # Link to Cloudflare project
npx nuxthub deploy   # Deploy to production
npx nuxthub manage   # Open admin dashboard
```

## 🌍 Deployment Strategy

**Git-First Multi-Environment Setup:**
- `main` branch → Production (`moma.pages.dev`)
- `staging` branch → Staging (`staging.moma.pages.dev`)  
- `feature/*` branches → Preview deployments

Deployments are automatic on push to respective branches via Cloudflare Pages.

## 📝 Contributing

We follow [Conventional Commits](https://conventionalcommits.org/) for all commit messages:

```bash
feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code restructuring
test: add/update tests
chore: maintenance tasks
```

## 📄 License

MIT License - feel free to use this project as inspiration for your own family art gallery!

## 🎨 About

Created with love for families who want to celebrate their children's creativity with the sophistication of a world-class museum experience.

---

**Built with [Nuxt](https://nuxt.com/) + [NuxtHub](https://hub.nuxt.com/) + [Cloudflare](https://cloudflare.com/)**
