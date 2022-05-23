import { SQL } from "@my-sst-app/core/sql";
import { Generated } from "kysely";
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
    comments: {
      id: string;
      articleID: string;
      text: string;
    };
  }
}

export async function addComment(articleID: string, text: string) {
  return await SQL.DB.insertInto("comments")
    .values({
      id: ulid(),
      articleID,
      text,
    })
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function comments(articleID: string) {
  return await SQL.DB.selectFrom("comments")
    .selectAll()
    .where("articleID", "=", articleID)
    .execute();
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
