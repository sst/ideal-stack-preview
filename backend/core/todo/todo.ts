import { Context } from "../context";

type CreateOpts = {
  id: string;
  title: string;
  user: string;
};

type Info = {
  id: string;
  title: string;
  user: string;
};

export async function create(ctx: Context, opts: CreateOpts): Promise<Info> {
  if (ctx.actor.properties.id !== opts.id)
    throw new Error("Actor is not allowed to do this");
  return opts;
}

type ForUserOpts = {
  userId: string;
};

export async function forUser(
  ctx: Context,
  _opts: ForUserOpts
): Promise<Info[]> {
  return [
    {
      id: "todo1",
      title: "example 1",
      user: ctx.actor.properties.id,
    },
    {
      id: "todo2",
      title: "example 2",
      user: ctx.actor.properties.id,
    },
  ];
}
