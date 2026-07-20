import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b1220",
        brand: "#0f766e",
        accent: "#b7791f"
      },
      borderRadius: {
        premium: "8px"
      },
      boxShadow: {
        premium: "0 24px 70px rgba(15, 23, 42, 0.13)"
      }
    }
  },
  plugins: []
};

export default config;
