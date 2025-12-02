/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // --- DEFINING BRAND COLORS & FONT FAMILIES ---
      colors: {
        'brand-beige': '#FDF9F5',  // Background (Warm cream)
        'brand-dark': '#2D2420',   // Text (Deep warm charcoal)
        'brand-accent-light': '#EA7C3A', // Orange/Amber (Primary Button)
        'brand-accent-dark': '#D97706',  // Darker Orange (Hover)
        'brand-teal': '#14B8A6',        // Secondary accent
      },
      fontFamily: {
        'serif': ['Merriweather', 'Playfair Display', 'serif'], // For Headings
        'sans': ['Inter', 'Lato', 'sans-serif'], // For Body text
      }
    },
  },
  plugins: [],
}