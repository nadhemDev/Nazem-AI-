import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        nazem: {
          pink: "#E83B81",
          teal: "#1FD5C2",
          darkBg: "#090d16",
          lightBg: "#f8fafc",
        }
      },
    },
  },
  plugins: [],
};
export default config;
