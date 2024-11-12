const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    './base.js',
    'plugin:@next/next/recommended',
    "plugin:tailwindcss/recommended",
    "plugin:react/recommended",
		"plugin:react-redux/recommended",
		"plugin:react/jsx-runtime",
		"plugin:react-hooks/recommended",
    "plugin:css/recommended",
    "plugin:@tanstack/query/recommended"
  ],
  plugins: [ 
    "react",
		"react-redux",
    "write-good-comments",
    "react-refresh",
		"css"
  ],
  settings: {
    "version": 19,
  },
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  ignorePatterns: [
    '**/dist/**/*.js',
    '**/node_modules/**/*.js',
  ],
  rules: {
    "tailwindcss/no-contradicting-classname": "off", // Currently a bug https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/177
    'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'react/prefer-stateless-function': 'error',
      'react/button-has-type': 'error',
      'react/no-unused-prop-types': 'error',
      'react/jsx-pascal-case': 'error',
      'react/jsx-no-script-url': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-danger-with-children': 'error',
      'react/no-unstable-nested-components': ['error', { allowAsProps: true }],
      'react/jsx-fragments': 'error',
      'react/destructuring-assignment': [
        'error',
        'always',
        { destructureInSignature: 'always' },
      ],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-max-depth': ['error', { max: 5 }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'arrow-function' },
      ],
      'react/jsx-key': [
        'error',
        {
          checkFragmentShorthand: true,
          checkKeyMustBeforeSpread: true,
          warnOnDuplicates: true,
        },
      ],
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': 'warn',
      'react/no-typos': 'warn',
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-sort-props': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-one-expression-per-line': 'off',
      'react/prop-types': 'off',
      'react/jsx-newline': ['error', { 'prevent': true }],
      'react/forbid-prop-types': 'off',
      'react/jsx-boolean-value': 'error',
      'react/jsx-closing-bracket-location': 'error',
      'react/jsx-curly-spacing': 'error',
      'react/jsx-handler-names': 'error',
      'react/jsx-indent': ['error', 2],
      'react/jsx-max-props-per-line': ['error', { 'maximum': 1 }],
      'react/jsx-first-prop-new-line': ['error', 'multiline'],
      'react/jsx-no-bind': 'off',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-literals': 'off',
      'react/jsx-no-undef': 'error',
      'react/jsx-sort-prop-types': 'off',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-deprecated': 'error',
      'react/no-did-mount-set-state': 'error',
      'react/no-did-update-set-state': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-is-mounted': 'error',
      'react/no-multi-comp': 'off',
      'react/no-set-state': 'error',
      'react/no-string-refs': 'off',
      'react/no-unknown-property': 'error',
      'react/prefer-es6-class': 'error',
      'react/sort-comp': 'error',
  }
};
