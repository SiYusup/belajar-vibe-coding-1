 import { Elysia } from "elysia";
import { db } from "./db";
import { usersRoute } from "./routes/users-route";

const app = new Elysia()
  .use(usersRoute)
  .get("/", () => ({
    message: "Hello World",
    status: "OK",
  }))
  .get("/db-test", async () => {
    if (!db) {
      return {
        status: "Database connection failed",
        error: "Database connection is not initialized. Check your credentials in .env",
      };
    }
    try {
      const result = await db.select().from(users).limit(1);
      return {
        status: "Database connected",
        data: result,
      };
    } catch (error: any) {
      return {
        status: "Database connection failed",
        error: error.message,
      };
    }
  })
  .listen(process.env.PORT || 3000);

console.log(
  `🚀 Server is running at ${app.server?.hostname}:${app.server?.port}`
);
