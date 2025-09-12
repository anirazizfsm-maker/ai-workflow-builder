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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Courier New', 'monospace'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glitch: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "5%": { transform: "translate(-1px, 1px)" },
          "10%": { transform: "translate(1px, -1px)" },
          "15%": { transform: "translate(-2px, 0)" },
          "20%": { transform: "translate(2px, 1px)" },
          "25%": { transform: "translate(-1px, -2px)" },
          "30%": { transform: "translate(3px, 0)" },
          "35%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(1px, -3px)" },
          "45%": { transform: "translate(-1px, 1px)" },
          "50%": { transform: "translate(0, 0)" },
          "55%": { transform: "translate(2px, -1px)" },
          "60%": { transform: "translate(-3px, 1px)" },
          "65%": { transform: "translate(2px, 3px)" },
          "70%": { transform: "translate(-2px, -1px)" },
          "75%": { transform: "translate(1px, 2px)" },
          "80%": { transform: "translate(-1px, -3px)" },
          "85%": { transform: "translate(3px, 1px)" },
          "90%": { transform: "translate(-2px, 2px)" },
          "95%": { transform: "translate(1px, -1px)" },
        },
        flow: {
          "0%": { "stroke-dashoffset": "0" },
          "100%": { "stroke-dashoffset": "-2400" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glitch: "glitch 1s infinite",
        flow: "flow 12s linear infinite",
        "flow-mid": "flow 7.5s linear infinite",
        "flow-fast": "flow 4.5s linear infinite",
      },
      boxShadow: {
        neo: "var(--neo-shadow)",
        "neo-strong": "var(--neo-shadow-strong)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addUtilities }) {
      addUtilities({
        '.chipset-vignette': {
          '-webkit-mask-image': 'radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
          'mask-image': 'radial-gradient(120% 90% at 50% 40%, rgba(0,0,0,1) 55%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.flow-line': {
          'stroke-linecap': 'round',
          'stroke-dasharray': '2400',
          'animation': 'flow 12s linear infinite',
          'filter': 'drop-shadow(0 0 6px oklch(0.69 0.22 26))',
        },
        '.flow-line-mid': {
          'stroke-linecap': 'round',
          'stroke-dasharray': '2000',
          'animation': 'flow 7.5s linear infinite',
          'filter': 'drop-shadow(0 0 7px oklch(0.69 0.22 26))',
          'opacity': '0.85',
        },
        '.flow-line-fast': {
          'stroke-linecap': 'round',
          'stroke-dasharray': '1800',
          'animation': 'flow 4.5s linear infinite',
          'filter': 'drop-shadow(0 0 8px oklch(0.69 0.22 26))',
          'opacity': '0.9',
        },
      });
    },
  ],
}