import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("wikimedia/client", "wikimedia/jquery", "wikimedia/mediawiki"),
    {
        rules: {
            "no-var": "off",
            "prefer-arrow-callback": "off",
        },
        languageOptions: {
            ecmaVersion: 5,
            sourceType: "script",
            globals: {
                ...globals.browser,
                ...globals.jquery
            }
        }
    }
];
