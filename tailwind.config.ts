import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#0B0F1A",
        foreground: "#FFFFFF",
        card: {
          DEFAULT: "#151B2A",
          border: "#1F2937",
        },
        primary: {
          start: "#7C3AED",
          end: "#3B82F6",
        },
        text: {
          primary: "#FFFFFF",
          secondary: "#94A3B8",
          muted: "#64748B",
        },
        accent: {
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        premium: "0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3)",
        glow: "0 0 20px -5px rgba(124, 58, 237, 0.4)",
      }
    },
  },
  plugins: [],
};

export default config;
