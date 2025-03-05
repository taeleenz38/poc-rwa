import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      primary: "#9571f6",
      secondary: "#9571f6",
      "secondary-focus": "#9F7EF6",
      black: "#000000",
      white: "#FFFFFF",
      light: "#F5F2F2",
      gray: "#595959",
      orange: "#FFA500",
      red: "#FF0000",
      green: "#0a610a",
    },
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-pattern": "url('/Graphic1.png')",
        "multi-color-gradient":
          "linear-gradient(to right, white, #031329, #031329, #031329, white)",
        "multi-color-gradient-div":
          "linear-gradient(to right, #031329, white, white, white, #031329), linear-gradient(to bottom, #031329, white, white, white, #031329)",
      },
    },
  },
  daisyui: {
    themes: [
      {
        dark: {
          primary: "#9571f6",
          "primary-focus": "#9571f6",
          "primary-content": "#9571f6",
          secondary: "rgb(128,128,128)",
          "secondary-focus": "#9F7EF6",
          "secondary-content": "#9571f6",
          buttonhover: "#9F7EF6",
          accent: "#000000",
          gray: "#595959",
          "accent-focus": "#2aa79b",
          "accent-content": "#ffffff",
          neutral: "#000000",
          "neutral-focus": "#16181d",
          "neutral-content": "#ffffff",
          base: "#F5F2F2",
          "base-content": "#ebecf0",
          info: "#000000",
          success: "#87d039",
          warning: "#e2d562",
          error: "#ff6f6f",
          light: "#F5F2F2",
          black: "#000000",
          white: "#FFFFFF",
        },
      },
      "light",
    ],
  },
  plugins: [require("daisyui")],
};
export default config;
