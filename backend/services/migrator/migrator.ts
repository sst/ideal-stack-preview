import { SQL } from "@acme/core";
import path from "path";
import { FileMigrationProvider, Migrator } from "kysely";

export async function handler() {
  const migrator = new Migrator({
    db: SQL.DB,
    provider: new FileMigrationProvider(path.resolve("./backend/migrations")),
  });
  console.log(await migrator.migrateToLatest());
}
