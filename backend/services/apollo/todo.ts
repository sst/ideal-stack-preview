import { Context, Todo } from "@acme/core";
import { Resolvers } from "./types";

export const TodoResolver: Resolvers<Context> = {
  Mutation: {
    createTodo: async (_parent, args, ctx) =>
      await Todo.create(ctx, args.input),
  },
  User: {
    todos: async (parent, _args, ctx) =>
      Todo.forUser(ctx, { userId: parent.id }),
  },
};
