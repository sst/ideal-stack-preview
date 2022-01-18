const { printSchemaWithDirectives } = require("@graphql-tools/utils");
const { stripIgnoredCharacters } = require("graphql");

const print = (schema) => `
  import { gql } from "graphql-tag"
  export const typeDefs = gql\`${schema}\`;
`;

module.exports.plugin = (schema) =>
  print(stripIgnoredCharacters(printSchemaWithDirectives(schema)));
