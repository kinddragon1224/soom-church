import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f7f8fb",
        foreground: "#1f2937",
        card: "#ffffff",
        primary: {
          DEFAULT: "#355c9a",
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#eff3f9",
          foreground: "#6b7280"
        },
        border: "#d9e2ee"
      },
    },
  },
  plugins: [],
};

export default config;
