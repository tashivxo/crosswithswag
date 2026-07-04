import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "void-black": "#0A0A0A",
        stone: "#575D61",
        clay: "#8C5E4A",
        sand: "#D6D1C4",
      },
      fontFamily: {
        sans: ["Instrument Sans", "sans-serif"],
      },
      letterSpacing: {
        display: "-0.04em",
        label: "0.2em",
      },
    },
  },
  plugins: [],
};

export default config;
