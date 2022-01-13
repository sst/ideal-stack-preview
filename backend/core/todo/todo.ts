import { SQL } from "../sql";
import { Context } from "../context";

type CreateOpts = {
  id: string;
  title: string;
};

export async function create(ctx: Context, opts: CreateOpts) {
  const user = ctx.assertAuthenticated();
  const result = await SQL.DB.insertInto("todos")
    .values({
      id: opts.id,
      title: opts.title,
      author_id: user.id,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
  return result;
}

export async function remove(ctx: Context, id: string) {
  const user = ctx.assertAuthenticated();
  const result = await SQL.DB.deleteFrom("todos")
    .where("id", "=", id)
    .where("author_id", "=", user.id)
    .returningAll()
    .executeTakeFirstOrThrow();
  return result;
}

type ForUserOpts = {
  userId: string;
};

export async function forUser(ctx: Context, opts: ForUserOpts) {
  ctx.assertAuthenticated();
  const results = await SQL.DB.selectFrom("todos")
    .selectAll()
    .where("author_id", "=", opts.userId)
    .execute();
  return results;
}
