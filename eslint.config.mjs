import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignorePatterns: ["lib/generated/prisma/**"],
    rules: {
      // Disable explicit any errors
      "@typescript-eslint/no-explicit-any": "off",

      // Disable empty object type errors
      "@typescript-eslint/no-empty-object-type": "off",

      // Disable unnecessary type constraint errors
      "@typescript-eslint/no-unnecessary-type-constraint": "off",

      // Disable no-unused-vars errors (optional)
      "@typescript-eslint/no-unused-vars": "off",

      // Disable react-hooks errors for dev purposes (optional)
      "react-hooks/rules-of-hooks": "off",

      // Disable no-img-element if you want (optional)
      "@next/next/no-img-element": "off",

      // Disable no-sync-scripts errors
      "@next/next/no-sync-scripts": "off",

      // Disable no-unescaped-entities errors in React
      "react/no-unescaped-entities": "off",
    },
  },
];

export default eslintConfig;
