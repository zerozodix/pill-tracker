## Pill Tracker PWA

A modern Progressive Web App for tracking medication schedules, built with Nuxt 3, Nuxt UI, and PWA capabilities.

### Features

- 📱 **Progressive Web App** - Installable on mobile and desktop
- 🎨 **Modern UI** - Built with Nuxt UI components and Tailwind CSS
- 🌙 **Dark Mode** - Automatic dark/light theme switching
- 📅 **Schedule Management** - Track daily medication schedules
- ✅ **Progress Tracking** - Visual progress indicators and statistics
- 🔔 **Notifications** - Toast notifications for actions
- 📱 **Mobile-First** - Responsive design optimized for mobile devices
- ♿ **Accessible** - WAI-ARIA compliant with keyboard navigation

### Technology Stack

- **Framework**: Nuxt 3
- **UI Library**: Nuxt UI (Reka UI + Tailwind CSS)
- **PWA**: @vite-pwa/nuxt
- **Styling**: Tailwind CSS v4
- **Icons**: Heroicons (via Iconify)
- **TypeScript**: Full TypeScript support

### Getting Started

1. **Install Dependencies**
   ```bash
   yarn install
   ```

2. **Development Server**
   ```bash
   yarn dev
   ```

3. **Build for Production**
   ```bash
   yarn build
   ```

4. **Preview Production Build**
   ```bash
   yarn preview
   ```

### PWA Features

- **Offline Support**: Service worker for offline functionality
- **App Installation**: Install prompt for mobile and desktop
- **Auto Updates**: Automatic service worker updates
- **Native App Feel**: Full-screen mode and native navigation
- **Push Notifications**: Ready for notification implementation

### Project Structure

```
├── app.vue                 # Root app component with UApp wrapper
├── nuxt.config.ts         # Nuxt configuration with UI and PWA
├── assets/
│   └── css/main.css       # Tailwind CSS and custom styles
├── layouts/
│   └── default.vue        # Main layout with navigation
├── pages/
│   ├── index.vue          # Home dashboard
│   ├── add-pill.vue       # Add medication form
│   └── schedule.vue       # Daily schedule view
├── public/                # Static assets and PWA icons
└── .vscode/               # VS Code configuration

```

### Customization

The app follows Nuxt UI guidelines and can be easily customized:

- **Colors**: Modify color scheme in `nuxt.config.ts`
- **Themes**: Update CSS custom properties in `main.css`
- **Components**: All components use Nuxt UI's theming system
- **PWA**: Configure manifest and service worker in `nuxt.config.ts`

### Development Notes

- VSCode settings included for optimal Nuxt UI development
- Tailwind CSS IntelliSense configured for `ui` prop support
- TypeScript strict mode enabled
- Auto-imports configured for components and composables

### Recommended VSCode Extensions

- Tailwind CSS IntelliSense
- Vue - Official
- Nuxt MDC
- Iconify IntelliSense
- TypeScript and JavaScript Language Features