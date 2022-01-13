import { SQL } from "@acme/core";
import path from "path";
import { FileMigrationProvider, Migrator } from "kysely";

export async function handler() {
  const migrator = new Migrator({
    db: SQL.DB,
    provider: new FileMigrationProvider(path.resolve("./backend/migrations")),
  });
  const response = await migrator.migrateToLatest();
  if (response.error) throw response.error;
  return response.results;
}
