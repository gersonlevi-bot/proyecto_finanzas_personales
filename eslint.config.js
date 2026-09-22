import js from "@eslint/js";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    prettierConfig,
    {
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
            globals: { process: "readonly", console: "readonly" }
        },
        rules: {
            curly: ["error", "multi-or-nest"],
            eqeqeq: ["error", "always"],
            "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "no-undef": "error"
        }
    }
];
