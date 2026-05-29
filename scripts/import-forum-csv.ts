import { readFile } from "node:fs/promises";
import {
  csvRowsToSeedThreads,
  parseQuestionResponseCsv,
} from "../src/lib/forum/csv-import";

async function main() {
  const csvPath = process.argv[2];
  if (!csvPath) {
    throw new Error("Usage: tsx scripts/import-forum-csv.ts <csv-path>");
  }

  const csv = await readFile(csvPath, "utf8");
  const rows = parseQuestionResponseCsv(csv);
  const threads = csvRowsToSeedThreads(rows);
  process.stdout.write(JSON.stringify(threads, null, 2));
  process.stdout.write("\n");
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
