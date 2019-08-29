module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended'
  ],
  // add your custom rules here
  rules: {
    'nuxt/no-cjs-in-config': 'off',
    "quotes": [0, "double"],
    "semi": 0,
    '@typescript-eslint/no-unused-vars': 'error',
    'indent': 'off',
    'unused': false,
    'vue/script-indent': ['warn', 2, {
      'baseIndent': 1
    }],
    "space-before-function-paren": 0,
    "eol-last": 0,
    "no-multiple-empty-lines": ["error", {
      "max": 1,
      "maxEOF": 0
    }],
    'arrow-parens': 'off',
    'no-console': 'off',
    'no-multi-str': 'off'
  },

}