import type { Config } from "tailwindcss";

const config: Config = {
  // Tema controlado por classe no <html> — ver components/shared/TemaProvider.tsx
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "hsl(var(--bg) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        muted: "hsl(var(--muted) / <alpha-value>)",
        line: "hsl(var(--line) / <alpha-value>)",
        overlay: "hsl(var(--overlay) / <alpha-value>)",
        // Painel de marca — meia-noite nos dois temas
        brand: {
          DEFAULT: "hsl(var(--brand) / <alpha-value>)",
          fg: "hsl(var(--brand-fg) / <alpha-value>)",
        },
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          fg: "hsl(var(--primary-fg) / <alpha-value>)",
          soft: "hsl(var(--primary-soft) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          fg: "hsl(var(--accent-fg) / <alpha-value>)",
          soft: "hsl(var(--accent-soft) / <alpha-value>)",
        },
        // Ouro — `gold` para texto (AA), `gold-solid` para preenchimento
        gold: {
          DEFAULT: "hsl(var(--gold) / <alpha-value>)",
          solid: "hsl(var(--gold-solid) / <alpha-value>)",
          fg: "hsl(var(--gold-fg) / <alpha-value>)",
          soft: "hsl(var(--gold-soft) / <alpha-value>)",
        },
        success: "hsl(var(--success) / <alpha-value>)",
        danger: "hsl(var(--danger) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 1px 2px hsl(var(--shadow) / var(--shadow-1)), 0 10px 30px -18px hsl(var(--shadow) / var(--shadow-2))",
        card: "0 1px 3px hsl(var(--shadow) / var(--shadow-1)), 0 24px 48px -32px hsl(var(--shadow) / var(--shadow-3))",
        glow: "0 12px 40px -12px hsl(var(--primary) / 0.45)",
        // Brilho de marca — usado nos selos vermelhão do painel de login
        ember: "0 12px 40px -12px hsl(var(--accent) / 0.5)",
        // Brilho premium — assinatura, IA
        gilt: "0 12px 40px -14px hsl(var(--gold-solid) / 0.55)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(14px)" },
          // `none` e não `translateY(0)`: a animação roda com fill-mode `both`,
          // então o estado final fica aplicado para sempre — e um transform,
          // mesmo neutro, faz o elemento virar bloco de contenção de qualquer
          // descendente `position: fixed`. Visualmente idêntico.
          to: { opacity: "1", transform: "none" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        // Gaveta de navegação do celular, entrando pela borda esquerda
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-100%)" },
          to: { opacity: "1", transform: "none" },
        },
        // Selo que infla ao aparecer — usado nos dígitos verificados
        pop: {
          "0%": { opacity: "0", transform: "scale(0.4)" },
          "60%": { opacity: "1", transform: "scale(1.15)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        // Negativa curta, para código incorreto
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%": { transform: "translateX(-7px)" },
          "40%": { transform: "translateX(6px)" },
          "60%": { transform: "translateX(-4px)" },
          "80%": { transform: "translateX(2px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "fade-in": "fade-in 0.6s ease both",
        "slide-in-left": "slide-in-left 0.28s cubic-bezier(0.22,1,0.36,1) both",
        pop: "pop 0.42s cubic-bezier(0.22,1,0.36,1) both",
        shake: "shake 0.5s ease-in-out both",
      },
    },
  },
  plugins: [],
};

export default config;
