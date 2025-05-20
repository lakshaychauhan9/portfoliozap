import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "zap-blue": "#1E90FF",
        "zap-gray": "#1F2937",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      spacing: {
        "1": "4px",
        "2": "8px",
      },
    },
  },
  plugins: [],
} satisfies Config;
