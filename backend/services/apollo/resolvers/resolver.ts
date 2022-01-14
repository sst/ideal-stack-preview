import { Context } from "core/context";
import { Resolvers } from "../types";

export function defineResolver(input: Resolvers<Context>): Resolvers<Context> {
  return input;
}
