import globals from "globals";
import pluginJs from "@eslint/js";
import pluginJest from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest, // Add Jest globals
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Add Jest-specific rules if needed
    },
  },
  {
    files: ["**/*.test.js", "**/*.spec.js"], // Apply Jest configuration to test files
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Ensure Jest globals are available in test files
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // Add Jest-specific rules if needed
    },
    plugins: {
      jest: pluginJest,
    },
    extends: [
      'plugin:jest/recommended', // Use Jest's recommended rules
    ],
  },
  pluginJs.configs.recommended,
];