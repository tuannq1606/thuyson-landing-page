/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Be Vietnam Pro", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
        ink: {
          950: "#0c1222",
          900: "#111827",
        },
      },
      boxShadow: {
        card: "0 4px 6px -1px rgb(0 0 0 / 0.06), 0 10px 24px -4px rgb(15 23 42 / 0.08)",
        "card-hover":
          "0 12px 32px -8px rgb(37 99 235 / 0.18), 0 4px 12px -2px rgb(0 0 0 / 0.06)",
        header: "0 1px 0 0 rgb(15 23 42 / 0.06)",
        "header-scrolled":
          "0 4px 24px -4px rgb(15 23 42 / 0.12), 0 1px 0 0 rgb(15 23 42 / 0.06)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(1.35rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        heroKen: {
          "0%": { transform: "scale(1.14)" },
          "100%": { transform: "scale(1)" },
        },
        blurFadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(2rem) scale(0.94)",
            filter: "blur(14px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0) scale(1)",
            filter: "blur(0)",
          },
        },
        headerDrop: {
          "0%": { opacity: "0", transform: "translateY(-1.25rem)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        lineReveal: {
          "0%": { transform: "scaleX(0)", opacity: "0" },
          "100%": { transform: "scaleX(1)", opacity: "1" },
        },
        heroShimmer: {
          "0%": { transform: "translateX(-120%) skewX(-18deg)", opacity: "0" },
          "12%": { opacity: "0.4" },
          "100%": { transform: "translateX(220%) skewX(-18deg)", opacity: "0" },
        },
        auroraDrift: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1)" },
          "50%": { transform: "translate(8%, -6%) scale(1.08)" },
        },
        auroraDriftAlt: {
          "0%, 100%": { transform: "translate(0%, 0%) scale(1.05)" },
          "50%": { transform: "translate(-10%, 8%) scale(1)" },
        },
        ctaRing: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(0, 104, 255, 0.45)" },
          "55%": { boxShadow: "0 0 0 10px rgba(0, 104, 255, 0)" },
        },
        lineGlow: {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.85" },
        },
        heroBrandIn: {
          "0%": {
            opacity: "0",
            transform: "scale(0.9) translateY(1.5rem)",
            filter: "blur(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)",
            filter: "blur(0)",
          },
        },
        svcLineReveal: {
          "0%": {
            opacity: "0",
            transform: "translateX(-1.25rem)",
            filter: "blur(8px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
            filter: "blur(0)",
          },
        },
        techPanelIn: {
          "0%": { opacity: "0", transform: "translateY(0.5rem) scale(0.98)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
      animation: {
        "fade-up": "fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fadeIn 0.6s ease-out both",
        "blur-fade-up": "blurFadeUp 1.05s cubic-bezier(0.16, 1, 0.3, 1) both",
        "header-in": "headerDrop 0.85s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-line": "lineReveal 1.15s cubic-bezier(0.22, 1, 0.36, 1) both",
        "hero-shimmer": "heroShimmer 2.4s cubic-bezier(0.22, 1, 0.36, 1) 0.45s both",
        "aurora-slow": "auroraDrift 14s ease-in-out infinite",
        "aurora-slow-alt": "auroraDriftAlt 18s ease-in-out infinite",
        "hero-ken": "heroKen 28s cubic-bezier(0.25, 0.1, 0.25, 1) forwards",
        "cta-ring": "ctaRing 2.8s ease-out infinite",
        "line-glow": "lineGlow 3.5s ease-in-out infinite",
        "hero-brand": "heroBrandIn 1.35s cubic-bezier(0.16, 1, 0.28, 1) both",
        "svc-line": "svcLineReveal 0.72s cubic-bezier(0.22, 1, 0.36, 1) both",
        "tech-panel": "techPanelIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
}

