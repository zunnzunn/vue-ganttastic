/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution")

module.exports = {
  root: true,

  extends: [
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier"
  ],

  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    quotes: ["error", "double"],
    // "object-curly-spacing": ["error", "never"],
    "prettier/prettier": ["error", {}, { usePrettierrc: true }]
  }
}
