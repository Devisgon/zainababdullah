import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";

/** In-memory SQLite executes the same SQL as D1 without touching production records. */
export function databaseFixture() {
  const sqlite = new DatabaseSync(":memory:");
  for (const migration of readdirSync("drizzle")
    .filter((name) => name.endsWith(".sql"))
    .sort())
    sqlite.exec(
      readFileSync(`drizzle/${migration}`, "utf8").replaceAll(
        "--> statement-breakpoint",
        "",
      ),
    );
  function statement(sql: string, bindings: unknown[] = []): any {
    return {
      bind(...values: unknown[]) {
        return statement(sql, values);
      },
      async first() {
        return sqlite.prepare(sql).get(...(bindings as any[])) || null;
      },
      async all() {
        return { results: sqlite.prepare(sql).all(...(bindings as any[])) };
      },
      async run() {
        const result = sqlite.prepare(sql).run(...(bindings as any[]));
        return { success: true, meta: { changes: Number(result.changes) } };
      },
    };
  }
  const db = {
    prepare: statement,
    async batch(statements: any[]) {
      return Promise.all(statements.map((item) => item.run()));
    },
  } as unknown as D1Database;
  return { db, sqlite, close: () => sqlite.close() };
}
