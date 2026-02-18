import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0F1B2D',
          dark: '#080F1A',
          light: '#1A2E4A',
          50: '#EEF1F5',
          100: '#D0D9E6',
        },
        charcoal: {
          DEFAULT: '#2C3E50',
          light: '#3D5166',
        },
        gold: {
          DEFAULT: '#B8860B',
          light: '#D4A843',
          50: '#FDF8EC',
          100: '#F9EDCA',
        },
        surface: '#F8F9FA',
        'text-primary': '#1A1A2E',
        'text-secondary': '#5A6977',
        border: '#E2E8F0',
        success: '#1B7340',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        display: ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.1', fontWeight: '700' }],
        heading: ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
        subheading: ['clamp(1.25rem, 2vw, 1.5rem)', { lineHeight: '1.3', fontWeight: '600' }],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(15,27,45,0.08)',
        'card-hover': '0 8px 40px rgba(15,27,45,0.15)',
        gold: '0 4px 20px rgba(184,134,11,0.25)',
      },
      backgroundImage: {
        'navy-gradient': 'linear-gradient(135deg, #0F1B2D 0%, #1A2E4A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #B8860B 0%, #D4A843 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
