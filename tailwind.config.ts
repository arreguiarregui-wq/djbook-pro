import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        bg: '#0a0a0f',
        surface: '#13131a',
        surface2: '#1c1c28',
        accent: '#e879f9',
        accent2: '#7c5ff5',
        border: 'rgba(255,255,255,0.08)',
      },
    },
  },
  plugins: [],
}
export default config
