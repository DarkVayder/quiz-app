/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: "#6B2BF5", // Purple theme
          correct: "#4CAF50", // Green for correct answers
          incorrect: "#F44336", // Red for incorrect answers
        },
      },
    },
    plugins: [],
  };
  