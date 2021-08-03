/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
module.exports = {
  experimental: {
    darkModeVariant: true
  },
  purge: {
    // Learn more on https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css
    enabled: process.env.NODE_ENV === "production",
    content: [
      "components/**/*.vue",
      "layouts/**/*.vue",
      "pages/**/*.vue",
      "plugins/**/*.js",
      "nuxt.config.js"
    ]
  },
  dark: "class",
  theme: {
    screens: {
      md: "768px",
      lg: "1200px",
      xl: "1920px"
    }
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "dark"],
    borderColor: ["responsive", "hover", "focus", "dark"],
    boxShadow: ["responsive", "hover", "focus", "dark"],
    textColor: ["responsive", "hover", "focus", "dark"],
    textDecoration: ["responsive", "hover", "focus", "dark"]
  }
};
