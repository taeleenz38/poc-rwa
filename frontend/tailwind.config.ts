import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#031329",
      secondary: "#C99383",
      black: "#000000",
      white: "#FFFFFF",
      light: "#F5F2F2",
      gray: "#e6e6e6",
      orange: "#FFA500",
      red: "#FF0000",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "url('/usdy-background.svg')",
      },
    },
  },
  plugins: [],
};
export default config;
