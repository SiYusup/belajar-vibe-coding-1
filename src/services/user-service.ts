import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export const registerUser = async (payload: any) => {
  if (!db) {
    throw new Error("Database connection is not initialized.");
  }

  const { name, email, password } = payload;

  // 1. Validasi Ketersediaan Email
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "Email sudah terdaftar" };
  }

  // 2. Hashing Password menggunakan Bun.password (bcrypt)
  const hashedPassword = await Bun.password.hash(password, {
    algorithm: "bcrypt",
    cost: 10,
  });

  // 3. Simpan ke Database
  try {
    await db.insert(users).values({
      name,
      email,
      password: hashedPassword,
    });
    return { data: "OK" };
  } catch (error: any) {
    console.error("Registration error:", error);
    return { error: "Terjadi kesalahan saat menyimpan data" };
  }
};
