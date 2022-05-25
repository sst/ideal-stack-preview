import { Kysely } from "kysely";

/**
 * @param db {Kysely<any>}
 */
export async function up(db) {
  await db.schema
    .createTable("articles")
    .addColumn("id", "text", col => col.primaryKey())
    .addColumn("title", "text")
    .addColumn("url", "text")
    .addColumn("created", "timestamp", col => col.defaultTo("now()"))
    .execute();

  await db.schema
    .createIndex("idx_articles_created")
    .on("articles")
    .column("created")
    .execute();
}

/**
 * @param db {Kysely<any>}
 */
export async function down(db) {
  await db.schema.dropIndex("idx_articles_created").execute();
  await db.schema.dropTable("articles").execute();
}
