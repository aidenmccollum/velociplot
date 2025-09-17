# Velociplot - SvelteKit + Tailwind CSS Application

A modern web application built with SvelteKit and styled with Tailwind CSS, providing a fast and responsive development experience.

## 🏗️ Project Infrastructure

This application uses **SvelteKit** as the framework and **Tailwind CSS** for styling. Here's how the key technologies work together:

- **SvelteKit**: A full-stack framework for building web applications with Svelte
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development
- **Vite**: Lightning-fast build tool and development server
- **TypeScript**: Type-safe JavaScript for better developer experience

## 📁 Project Structure

```
velociplot/
├── src/
│   ├── routes/          # SvelteKit pages and routing
│   │   ├── +page.svelte     # Home page component
│   │   └── +layout.svelte   # Root layout wrapper
│   ├── lib/             # Reusable components and utilities
│   ├── app.css          # Global styles and Tailwind imports
│   ├── app.html         # HTML template
│   └── app.d.ts         # TypeScript declarations
├── static/              # Static assets (images, fonts, etc.)
├── package.json         # Dependencies and scripts
├── svelte.config.js     # SvelteKit configuration
├── vite.config.ts       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration (if customized)
└── tsconfig.json        # TypeScript configuration
```

## 📄 How Pages Are Laid Out

### Routing System
SvelteKit uses a **file-based routing** system. Pages are created in the `src/routes/` directory:

- `src/routes/+page.svelte` → Homepage at `/`
- `src/routes/about/+page.svelte` → About page at `/about`
- `src/routes/blog/[slug]/+page.svelte` → Dynamic route at `/blog/:slug`

### Layout Hierarchy
- **`+layout.svelte`**: Wraps all pages at its level and below
- Layouts can be nested for section-specific designs
- The root layout (`src/routes/+layout.svelte`) typically includes:
  - Navigation header
  - Footer
  - Common styles and scripts

### Page Components Structure
A typical SvelteKit page component:

```svelte
<script lang="ts">
  // TypeScript/JavaScript logic
  export let data; // Props from load functions
</script>

<div class="container mx-auto px-4">
  <h1 class="text-3xl font-bold text-gray-900">
    <!-- Tailwind classes for styling -->
  </h1>
</div>

<style>
  /* Component-specific styles (if needed) */
</style>
```

## ✏️ How to Make Edits

### 1. Creating New Pages
Create a new folder with a `+page.svelte` file in `src/routes/`:
```bash
mkdir src/routes/new-page
touch src/routes/new-page/+page.svelte
```

### 2. Adding Components
Create reusable components in `src/lib/components/`:
```svelte
<!-- src/lib/components/Button.svelte -->
<script lang="ts">
  export let variant: 'primary' | 'secondary' = 'primary';
</script>

<button class="px-4 py-2 rounded-lg {variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200'}">
  <slot />
</button>
```

### 3. Styling with Tailwind CSS
Apply utility classes directly in your components:
```svelte
<!-- Responsive design with Tailwind -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <!-- Content -->
  </div>
</div>
```

### 4. Global Styles
Edit `src/app.css` to add custom global styles or Tailwind directives:
```css
@import 'tailwindcss';

/* Custom global styles */
@layer base {
  h1 {
    @apply text-4xl font-bold mb-4;
  }
}
```

### 5. Loading Data
Use `+page.server.ts` or `+page.ts` for data loading:
```typescript
// src/routes/blog/+page.server.ts
export async function load() {
  const posts = await fetchBlogPosts();
  return {
    posts
  };
}
```

## 🚀 Running the Code Locally

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **pnpm** (Package manager - can also use npm or yarn)

### Installation
1. Clone the repository:
```bash
git clone <repository-url>
cd velociplot
```

2. Install dependencies:
```bash
pnpm install
# or: npm install
# or: yarn install
```

### Development Server
Start the development server with hot module replacement:
```bash
npm run dev

# The app will be available at http://localhost:5173
```

### Building for Production
Create an optimized production build:
```bash
npm run build
```

### Preview Production Build
Test the production build locally:
```bash
npm run preview

# Preview at http://localhost:4173
```

### Type Checking
Run TypeScript type checking:
```bash
npm run check

# Watch mode for continuous checking:
pnpm check:watch
```

## 🛠️ Development Tips

### Hot Module Replacement (HMR)
- Changes to Svelte components update instantly in the browser
- Tailwind CSS classes are compiled on-the-fly during development
- State is preserved during component updates

### VSCode Extensions
Recommended extensions for the best development experience:
- **Svelte for VS Code**: Syntax highlighting and IntelliSense
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Prettier**: Code formatting

### Debugging
- Use browser DevTools for client-side debugging
- Add `{@debug variable}` in Svelte templates to log values
- Server-side logs appear in the terminal running `pnpm dev`

### Performance Optimization
- SvelteKit automatically code-splits routes
- Static assets in `/static` are served directly
- Use `+page.server.ts` for server-side rendering (SSR)
- Implement `+page.ts` for client-side rendering when appropriate

## 📚 Additional Resources

- [SvelteKit Documentation](https://kit.svelte.dev/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [Vite Documentation](https://vitejs.dev/)

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes following the existing code style
3. Test your changes locally
4. Submit a pull request with a clear description

## 📝 License

[Add your license information here]
