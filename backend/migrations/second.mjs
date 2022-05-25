import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("comments")
    .addColumn("id", "text", col => col.primaryKey())
    .addColumn("articleID", "text")
    .addColumn("text", "text")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropTable("comments").execute();
}
