
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/gql/schema.json",
  documents: "src/**/*.vue",
  generates: {
    "src/gql/schema.json": {
      plugins: ["introspection"],
      schema: "http://localhost:8080/graphql"
    },
    "src/gql/types": {
      preset: "client",
      plugins: []
    },
  }
};

export default config;
