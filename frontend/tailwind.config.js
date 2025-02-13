module.exports = {
    content: [
      "./src//*.{js,jsx,ts,tsx}",
      "node_modules/flowbite-react//*.{js,jsx,ts,tsx}"
    ],
    theme: {
      extend: {},
    },
    plugins: [require("flowbite/plugin")],
  };
 /** @type {import('tailwindcss').Config} */
 export default {
    content: ["./src/**/*.{html,js}"],
    theme: {
      extend: {},
    },
    plugins: [],
  }