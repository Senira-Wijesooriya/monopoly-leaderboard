import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        board: "#0F5132", // deep felt green
        cream: "#F3E7C9", // deed-card paper
        ink: "#221C10", // near-black warm text
        gold: "#C89B3C", // banknote gold
        brick: "#9C2B1E", // primary action red
        chest: "#1F5C8B", // community chest blue
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
