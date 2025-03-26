// /** @type {import('tailwindcss').Config} */
// export default {
//   darkMode: "media",
//   content: [
//     "./index.html",
//     "./src/**/*.{js,ts,jsx,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],

// }

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "media",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "pulse-border": "pulse-border 1.5s infinite ease-in-out",
      },
      keyframes: {
        "pulse-border": {
          "0%, 100%": { borderColor: "rgb(139, 92, 246)", opacity: "1" },  // Violet
          "50%": { borderColor: "rgb(199, 210, 254)", opacity: "0.6" },   // Light Indigo
        },
      },
      animation: {
        "border-glow": "border-glow 2s infinite linear",
      },
      keyframes: {
        "border-glow": {
          "0%, 100%": { borderColor: "rgb(139, 92, 246)", borderWidth: "4px", opacity: "1" },  // Violet
          "50%": { borderColor: "rgb(236, 72, 153)", borderWidth: "6px", opacity: "0.8" },     // Pinkish Glow
        },
      },
    },
  },
  plugins: [],
};


