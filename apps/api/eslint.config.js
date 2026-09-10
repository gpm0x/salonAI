import tseslint from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  { ignores: ["src/**/__tests__/**"] },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      // SEC-05: Prohibit unsafe Prisma raw queries.
      // Use Prisma.sql`...` tagged template with $queryRaw instead.
      "no-restricted-properties": [
        "error",
        {
          property: "$queryRawUnsafe",
          message:
            "SEC-05: $queryRawUnsafe is prohibited. Use $queryRaw with Prisma.sql`...` tagged template.",
        },
        {
          property: "$executeRawUnsafe",
          message:
            "SEC-05: $executeRawUnsafe is prohibited. Use $executeRaw with Prisma.sql`...` tagged template.",
        },
      ],
    },
  },
]
