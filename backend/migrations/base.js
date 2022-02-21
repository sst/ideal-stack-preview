export async function up(db) {
  await db.schema
    .createTable("todos")
    .addColumn("id", "text", (col) => col.primaryKey())
    .addColumn("title", "text")
    .addColumn("completed", "boolean")
    .addColumn("author_id", "text")
    .execute();
}

export async function down(db) {
  await db.schema.dropTable("todos").execute();
}

// // module.exports = { up, down };
// const base = { up, down };

// export default base;

// // export default const { up, down };
