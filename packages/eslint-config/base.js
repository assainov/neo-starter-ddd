const { resolve } = require('node:path');
 
const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    "plugin:@typescript-eslint/recommended",
    "plugin:eslint-comments/recommended",
    // "plugin:vitest/recommended",
    "turbo",
  ],
  plugins: [ 
    '@typescript-eslint', 
    // 'vitest',
    'import',
     'unused-imports',
     "no-secrets", 
    ],
  ignorePatterns: [
    '**/dist/**/*.js',
    '**/node_modules/**/*.js',
  ],
  rules: {
    semi: [ 'error', 'always' ],
    quotes: [ 'error', 'single' ],
    'indent': [ 'error', 2 ],
    'no-multiple-empty-lines': [ 'error', { 'max': 1, 'maxEOF': 0 } ],
    'no-multi-spaces': 'error',
    'arrow-body-style': 'warn',
    'prefer-arrow-callback': [
      'warn',
      {
        allowNamedFunctions: true,
      },
    ],
    'no-trailing-spaces': [ 'error', { 'ignoreComments': true } ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'args': 'after-used',
        'argsIgnorePattern': '^_',
      },
    ],
    'import/no-dynamic-require': 'error',
    'object-curly-spacing': [ 'error', 'always' ],
    'array-bracket-spacing': [ 'error', 'always' ],
    '@typescript-eslint/explicit-member-accessibility': 'error',
    "@typescript-eslint/no-unsafe-assignment": "off",
    "@typescript-eslint/no-unsafe-argument": "off",
    "@typescript-eslint/no-unsafe-call": "off",
  }
};