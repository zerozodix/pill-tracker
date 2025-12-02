# Pill Tracker

A modern Progressive Web App (PWA) for tracking medication schedules, built with Nuxt 3, Nuxt UI, and TypeScript.

## 🚀 Features

- **📱 Progressive Web App** - Installable on mobile and desktop
- **💊 Pill Management** - Add, edit, and delete medications
- **⏰ Smart Scheduling** - Flexible frequency options (daily, weekly, monthly, as-needed)
- **🔔 Notifications** - Browser notifications for pill reminders
- **🌙 Dark Mode** - Built-in dark/light mode support
- **📱 Responsive Design** - Optimized for all screen sizes
- **💾 Offline Storage** - Works offline with localStorage persistence

## 🏗️ Project Structure

```
├── 📁 assets/
│   └── 📁 css/
│       └── main.css              # Global styles
├── 📁 components/
│   ├── 📁 pill/
│   │   ├── PillCard.vue          # Individual pill display component
│   │   └── PillForm.vue          # Pill creation/editing form
│   └── 📁 ui/                    # Reusable UI components
├── 📁 composables/
│   ├── usePills.ts               # Pill management logic
│   └── useNotifications.ts       # Notification handling
├── 📁 layouts/
│   └── default.vue               # Default layout
├── 📁 middleware/
│   └── auth.ts                   # Route middleware (example)
├── 📁 pages/
│   ├── index.vue                 # Home/dashboard page
│   ├── add-pill.vue              # Add new pill page
│   └── schedule.vue              # Schedule view page
├── 📁 plugins/
│   └── init.client.ts            # Client-side initialization
├── 📁 public/                    # Static assets
├── 📁 server/
│   └── 📁 api/
│       ├── pills.ts              # Pills API endpoints
│       └── 📁 pills/
│           └── [id].ts           # Individual pill operations
├── 📁 stores/
│   └── pills.ts                  # Pinia store for state management
├── 📁 types/
│   └── index.ts                  # TypeScript type definitions
├── 📁 utils/
│   ├── date.ts                   # Date/time utilities
│   └── validation.ts             # Form validation utilities
├── app.vue                       # Root component
├── nuxt.config.ts                # Nuxt configuration
└── package.json                  # Dependencies and scripts
```

## 🛠️ Tech Stack

- **Framework**: [Nuxt 3](https://nuxt.com/) - Vue.js meta-framework
- **UI Library**: [Nuxt UI](https://ui.nuxt.com/) - Beautiful components
- **State Management**: [Pinia](https://pinia.vuejs.org/) - Vue.js store
- **TypeScript**: Full type safety
- **PWA**: [@vite-pwa/nuxt](https://vite-pwa-org.netlify.app/frameworks/nuxt.html)
- **Form Validation**: [Zod](https://zod.dev/) - Schema validation
- **Utilities**: [@vueuse/core](https://vueuse.org/) - Vue composition utilities

## 📦 Installation

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Preview production build
yarn preview
```

## 🔧 Configuration

### PWA Settings

The app is configured as a PWA with offline capabilities. Key PWA features:

- **Manifest**: App can be installed on devices
- **Service Worker**: Caches resources for offline use
- **Icons**: Proper app icons for different platforms

### Environment Variables

Create a `.env` file for local development:

```env
# Add environment variables here when needed
# DATABASE_URL=...
# API_KEY=...
```

## 🚀 Deployment

This app can be deployed to any platform that supports Node.js:

- **Vercel** (recommended)
- **Netlify** 
- **Cloudflare Pages**
- **Traditional hosting**

```bash
# Build for production
yarn build

# The output will be in .output/ directory
```

## 🧪 Development Guidelines

### Code Organization

- **Components**: Organized by feature in subfolders
- **Composables**: Reusable logic, prefixed with `use`
- **Types**: Centralized in `types/index.ts`
- **Utils**: Pure functions for common operations
- **Stores**: Pinia stores for state management

### Naming Conventions

- **Files**: kebab-case (e.g., `pill-card.vue`)
- **Components**: PascalCase (e.g., `PillCard`)
- **Composables**: camelCase with `use` prefix (e.g., `usePills`)
- **Types**: PascalCase (e.g., `PillFrequency`)

### Best Practices

1. **TypeScript First**: Always use TypeScript for type safety
2. **Composition API**: Prefer Composition API over Options API
3. **Single Responsibility**: Keep components and functions focused
4. **Accessibility**: Use semantic HTML and ARIA attributes
5. **Performance**: Use computed properties and proper reactivity

## 📱 Features Overview

### Pill Management
- Add pills with detailed information (name, dosage, frequency, etc.)
- Visual pill representation with colors and shapes
- Instructions and side effects tracking

### Scheduling
- Flexible frequency options (daily, weekly, monthly, as-needed)
- Multiple times per day support
- Start and end date management

### Notifications
- Browser notifications for pill reminders
- Configurable reminder times
- Permission management

### Data Persistence
- localStorage for offline data storage
- Future-ready for backend integration
- Data import/export capabilities

## 🔮 Future Enhancements

- [ ] User authentication and multi-user support
- [ ] Cloud data synchronization
- [ ] Medication interaction warnings
- [ ] Health data export (PDF reports)
- [ ] Integration with health apps
- [ ] Prescription refill reminders
- [ ] Medication adherence analytics
- [ ] Family/caregiver sharing features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Nuxt 3 and modern web technologies.