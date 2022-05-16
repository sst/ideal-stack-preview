import { SQL } from "@my-sst-app/core/sql";
import { Generated, Selectable } from "kysely";
import { ulid } from "ulid";

export * as Article from "./article";

declare module "@my-sst-app/core/sql" {
  export interface Database {
    articles: {
      id: string;
      title: string;
      url: string;
      created: Generated<Date>;
    };
  }
}

export async function create(title: string, url: string) {
  const [result] = await SQL.DB.insertInto("articles")
    .values({ id: ulid(), url, title })
    .returningAll()
    .execute();
  return result;
}

export async function list() {
  return await SQL.DB.selectFrom("articles")
    .selectAll()
    .orderBy("created", "desc")
    .execute();
}

export async function fromID(id: string) {
  return await SQL.DB.selectFrom("articles")
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export type ArticleRow = Selectable<SQL.Database["articles"]>;
