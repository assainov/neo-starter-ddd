/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: [ '@neo/eslint-config/next.js' ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    'ecmaFeatures': {
      'jsx': true
    },
    projectService: {
      allowDefaultProject: [ '.eslintrc.js' ],
    },
    tsconfigRootDir: __dirname
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'tailwindcss/no-custom-classname': 'off'
  },
};
