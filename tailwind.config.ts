import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        board: "#3D1E63", // deep royal purple, brand background
        cream: "#F6ECD2", // deed-card paper
        ink: "#221C10", // near-black warm text
        gold: "#F0B429", // banknote gold
        brick: "#E31B23", // monopoly red, primary action
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
