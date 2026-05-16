import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

let connection;
try {
  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || undefined,
    database: process.env.DB_NAME || "app_vibe_coding",
    port: Number(process.env.DB_PORT) || 3306,
  });
} catch (e) {
  console.warn("⚠️ Database connection failed. DB-dependent features will not work.");
}

export const db = connection ? drizzle(connection, { schema, mode: "default" }) : null;

