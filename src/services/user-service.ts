import { db } from "../db";
import { users, sessions } from "../db/schema";
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

export const loginUser = async (payload: any) => {
  if (!db) {
    throw new Error("Database connection is not initialized.");
  }

  const { email, password } = payload;

  // 1. Pencarian User
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return { error: "Email atau password salah" };
  }

  // 2. Verifikasi Password
  const isPasswordValid = await Bun.password.verify(password, user.password);

  if (!isPasswordValid) {
    return { error: "Email atau password salah" };
  }

  // 3. Generate Session Token
  const token = crypto.randomUUID();

  try {
    await db.insert(sessions).values({
      token,
      userId: user.id,
    });
    return { data: token };
  } catch (error: any) {
    console.error("Login error:", error);
    return { error: "Terjadi kesalahan saat membuat session" };
  }
};
export const getCurrentUser = async (token: string) => {
  if (!db) {
    throw new Error("Database connection is not initialized.");
  }

  // 1. Pencarian Session & User dengan Join
  const result = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(eq(sessions.token, token))
    .limit(1);

  const user = result[0];

  if (!user) {
    return { error: "Unauthorized" };
  }

  return { data: user };
};
