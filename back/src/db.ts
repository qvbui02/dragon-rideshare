import path from "path";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import * as url from "url";

let __dirname = url.fileURLToPath(new URL("..", import.meta.url));
let dbInstance: any;

export async function getDb() {
  if (!dbInstance) {
    dbInstance = await open({
      filename: path.join(__dirname, process.env.DATABASE_FILE!),
      driver: sqlite3.Database,
    });
    await dbInstance.get("PRAGMA foreign_keys = ON");
  }
  return dbInstance;
}