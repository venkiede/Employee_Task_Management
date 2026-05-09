/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* ── Theme-aware semantic colors (CSS variable-based) ── */
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface:    'rgb(var(--color-surface) / <alpha-value>)',
        elevated:   'rgb(var(--color-elevated) / <alpha-value>)',
        'muted-bg': 'rgb(var(--color-muted-bg) / <alpha-value>)',
        border:     'rgb(var(--color-border) / <alpha-value>)',
        'border-subtle': 'rgb(var(--color-border-subtle) / <alpha-value>)',
        heading:    'rgb(var(--color-heading) / <alpha-value>)',
        body:       'rgb(var(--color-body) / <alpha-value>)',
        subtle:     'rgb(var(--color-subtle) / <alpha-value>)',
        faint:      'rgb(var(--color-faint) / <alpha-value>)',

        /* ── Brand colors (Theme-aware) ── */
        primary: {
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
        },
        accent: {
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
        },
        success: {
          50:  'rgb(var(--color-success-50) / <alpha-value>)',
          500: 'rgb(var(--color-success-500) / <alpha-value>)',
        },
        warning: {
          50:  'rgb(var(--color-warning-50) / <alpha-value>)',
          500: 'rgb(var(--color-warning-500) / <alpha-value>)',
        },
        danger: {
          500: 'rgb(var(--color-danger-500) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
