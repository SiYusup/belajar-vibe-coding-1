import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let connection;
try {
  connection = await mysql.createConnection({
    uri: process.env.DATABASE_URL || "mysql://root:password@localhost:3306/my_database",
  });
} catch (e) {
  console.warn("⚠️ Database connection failed. DB-dependent features will not work.");
}

export const db = connection ? drizzle(connection, { schema, mode: "default" }) : null;

