/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        void: {
          950: "#04050a",
          900: "#070910",
          800: "#0d1018",
          700: "#131620",
          600: "#1a1e2c",
          500: "#232840",
        },
        forge: {
          900: "#1c1208",
          800: "#2e1e0a",
          700: "#4a3010",
          600: "#6b4615",
          500: "#8b5e1a",
        },
        ember: {
          900: "#7a3a00",
          800: "#a05010",
          700: "#c8741c",
          600: "#e08c28",
          500: "#f0a830",
          400: "#f5bf58",
          300: "#fad580",
        },
        rune: { 400: "#7ab4e8", 300: "#9ecaf0", 200: "#c2dff8" },
        stone: {
          500: "#5a6480",
          400: "#7888a0",
          300: "#9aaabe",
          200: "#c0ccde",
          100: "#dce4f0",
        },
      },
      fontFamily: {
        display: ["'Cinzel Decorative'", "serif"],
        body: ["'Rajdhani'", "sans-serif"],
        mono: ["'Share Tech Mono'", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.45s cubic-bezier(0.16,1,0.3,1) both",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16,1,0.3,1) both",
        "slide-right": "slideRight 0.35s cubic-bezier(0.16,1,0.3,1) both",
        "ember-pulse": "emberPulse 3s ease-in-out infinite",
        scan: "scan 2.5s linear infinite",
        shimmer: "shimmer 1.8s linear infinite",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-16px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        emberPulse: {
          "0%,100%": { boxShadow: "0 0 6px 1px rgba(200,116,28,0.25)" },
          "50%": { boxShadow: "0 0 20px 4px rgba(200,116,28,0.55)" },
        },
        scan: {
          from: { backgroundPosition: "0 -100%" },
          to: { backgroundPosition: "0 200%" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
