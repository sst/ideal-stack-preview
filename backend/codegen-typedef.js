const { printSchemaWithDirectives } = require("@graphql-tools/utils")
const { gql } = require("apollo-server-lambda")
const { stripIgnoredCharacters } = require("graphql")

const print = (schema) => `
  import { gql } from "apollo-server-lambda"
  export const typeDefs = gql\`${schema}\`;
`

module.exports.plugin = (schema) =>
  print(stripIgnoredCharacters(printSchemaWithDirectives(schema)))
