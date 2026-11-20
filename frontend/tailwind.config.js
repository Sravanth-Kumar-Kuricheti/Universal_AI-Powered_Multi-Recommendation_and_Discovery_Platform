/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          dark: '#0B1020',
          sidebar: '#17102F',
          sidebarTo: '#211040',
          navbar: '#111329',
          hero: '#10152C',
          results: '#F7F7FC',
          card: '#FFFFFF',
        },
        brand: {
          purple: '#7C22F5',
          secondary: '#A855F7',
          highlight: '#C084FC',
          glow: '#A855F7',
        },
        border: {
          card: '#DCE0EE',
        },
        text: {
          primary: '#11152B',
          secondary: '#667085',
          dark: '#F8FAFC',
        },
        accent: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'card': '13px',
        'filter': '11px',
      },
      boxShadow: {
        'purple-glow': '0 0 25px -5px rgba(168, 85, 247, 0.4)',
        'purple-glow-sm': '0 0 15px -3px rgba(124, 34, 245, 0.35)',
        'card': '0 2px 8px 0 rgba(17, 21, 43, 0.04)',
        'card-hover': '0 10px 25px -5px rgba(124, 34, 245, 0.12), 0 8px 10px -6px rgba(17, 21, 43, 0.05)',
      }
    },
  },
  plugins: [],
}
