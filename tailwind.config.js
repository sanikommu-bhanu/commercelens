/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F7F3EC',
        'warm-white': '#FFFFFF',
        'brand-dark': '#3D2A1F',
        'brand-accent': '#7A3B1E',
        'brand-tan': '#C9A788',
        'text-muted': '#8B7E74',
        success: '#4C9A6B',
        danger: '#C4544A',
        star: '#E0A93A',
        dark: {
          bg: '#1E140D',
          surface: '#2B1D14',
          border: '#3D2A1F',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', '"Playfair Display"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      borderRadius: {
        xl2: '20px',
        xl3: '28px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(61,42,31,0.08)',
        softer: '0 4px 14px rgba(61,42,31,0.06)',
      },
      maxWidth: {
        shell: '430px',
      },
    },
  },
  plugins: [],
};
