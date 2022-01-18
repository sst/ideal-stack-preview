import { Todo } from "@acme/core";
import { Resolvers } from "./types";

export const TodoResolver: Resolvers = {
  Mutation: {
    createTodo: async (_parent, args, ctx) =>
      await Todo.create(ctx, args.input),
    removeTodo: async (_parent, args, ctx) => {
      return await Todo.remove(ctx, args.id);
    },
  },
  User: {
    todos: async (parent, _args, ctx) => {
      const results = await Todo.forUser(ctx, { userId: parent.id! });
      return results.map((r) => ({
        id: r.id,
        title: r.title,
      }));
    },
  },
};
