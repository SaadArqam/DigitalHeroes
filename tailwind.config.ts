import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B1220",
        card: {
          DEFAULT: "#111827",
          border: "#1F2937",
        },
        primary: {
          start: "#9333ea",
          end: "#3b82f6",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        input: {
          bg: "#1F2937",
          border: "#374151",
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        premium: "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -4px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px -5px rgba(147, 51, 234, 0.3)",
      }
    },
  },
  plugins: [],
};

export default config;
