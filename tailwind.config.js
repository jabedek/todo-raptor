/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      transitionProperty: {
        app_input_border: ["border-bottom"],
      },
      fontFamily: {
        app_primary: ["Manrope"],
        app_mono: ['"Azeret Mono"'],
      },
      colors: {
        app_primary: "#BA3F00",
        app_secondary: "#002d07",
        app_tertiary: "#FFCB2B",
        app_quarternary: "#FFC8C9",
        app_light: "#FFF1EB",
      },
      boxShadow: {
        app_form_button_focus: ".1px 2px 4px rgba(0,0,0,0.5)",
        app_form_button_active: ".1px 2px 4px rgba(0,0,0,0.75)",
      },
    },
    screens: {
      xs: "320px", // custom
      "2xs": "460px", // custom
      sm: "640px",
      md: "768px",
      mdx: "834px", // custom
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
};
