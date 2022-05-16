import { Chain, useZeusVariables } from "@my-sst-app/graphql/zeus";

const chain = Chain("https://b08531nku7.execute-api.us-east-1.amazonaws.com");

export const Client = {
  query: chain("query"),
  mutation: chain("mutation"),
};
