import js from "@eslint/js";
import globals from "globals";
import prettier from "eslint-config-prettier";
import pluginPrettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
      ecmaVersion: "latest",
      sourceType: "module",
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,

      "no-unused-vars": "warn",
      "no-console": "off",
      "no-undef": "error",
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],
      "prefer-const": "error",

      "prettier/prettier": "warn",
    },
    extends: [prettier],
    ignores: ["node_modules/", "dist/", "coverage/"],
  },
]);
