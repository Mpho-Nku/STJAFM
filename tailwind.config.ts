import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1f2937", // slate-800
          accent: "#f59e0b",  // amber-500
        }
      }
    },
  },
  plugins: [],
};
export default config;
