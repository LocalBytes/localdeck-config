// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt({
  // oxfmt always self-closes void elements (e.g. <input />); match it instead of fighting it.
  rules: { "vue/html-self-closing": ["warn", { html: { void: "always" } }] },
});
