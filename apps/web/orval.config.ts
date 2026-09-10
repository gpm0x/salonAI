import { defineConfig } from "orval"

export default defineConfig({
  salonApi: {
    input: {
      target: "http://localhost:3333/docs/json",
    },
    output: {
      target: "./src/generated/api",
      client: "react-query",
      mode: "tags-split",
      override: {
        mutator: {
          path: "./lib/api-instance.ts",
          name: "customInstance",
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
})
