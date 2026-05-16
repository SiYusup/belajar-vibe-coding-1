# Implementasi Fitur Login User & Session Management

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan fitur login user pada aplikasi ElysiaJS. Fitur ini mencakup pembuatan tabel `sessions` di database menggunakan Drizzle ORM, pembuatan service logic untuk memverifikasi kredensial user, serta pembuatan endpoint API untuk melayani request login.

---

## Spesifikasi Teknis

### 1. Pembuatan Tabel Sessions (`src/db/schema.ts`)
Tambahkan tabel baru bernama `sessions` ke dalam skema database. Tabel ini akan menyimpan token login yang digunakan untuk autentikasi user.

**Struktur Tabel `sessions`:**
- `id`: integer, primary key, auto increment
- `token`: varchar 255, not null *(Gunakan string UUID v4 sebagai token)*
- `userId`: integer, foreign key yang mereferensikan `id` pada tabel `users`.
- `createdAt`: timestamp, default current_timestamp
- `updatedAt`: timestamp, default current_timestamp, on update current_timestamp

**Tahapan Implementasi:**
1. Buka file `src/db/schema.ts`.
2. Definisikan tabel `sessions` menggunakan fungsi dari Drizzle (misalnya `mysqlTable`).
3. Buat field `userId` sebagai foreign key yang mengarah ke tabel `users` (misalnya menggunakan `.references(() => users.id)`).
4. Setelah skema diperbarui, jalankan perintah migrasi Drizzle (seperti `bun run db:generate` dan `bun run db:push`) untuk membuat tabel tersebut secara fisik di database MySQL.

### 2. Pembuatan Service Logic (`src/services/user-service.ts`)
Tambahkan fungsi logika bisnis baru untuk menangani login.

**Tahapan Implementasi:**
1. Buka file `src/services/user-service.ts`.
2. Buat fungsi asynchronous, misalnya `loginUser(payload)`.
3. **Pencarian User:** Lakukan query menggunakan Drizzle ke tabel `users` untuk mencari data berdasarkan `email` yang dikirim dari payload.
   - Jika user tidak ditemukan, segera kembalikan response error: `{ error: 'Email atau password salah' }`.
4. **Verifikasi Password:** Jika user ditemukan, bandingkan `password` dari request payload dengan password hash yang ada di database (bisa menggunakan `Bun.password.verify()`).
   - Jika verifikasi gagal, kembalikan response error: `{ error: 'Email atau password salah' }`.
5. **Generate Session Token:** Jika email dan password valid:
   - Buat sebuah token string menggunakan UUID (misal menggunakan `crypto.randomUUID()`).
   - Lakukan perintah insert ke tabel `sessions` untuk menyimpan `token` dan `userId` dari user yang berhasil login.
6. **Return Success:** Kembalikan token ke client dengan format: `{ data: '<token_yang_dihasilkan>' }`.

### 3. Pembuatan Endpoint API (`src/routes/users-route.ts`)
Tambahkan route HTTP baru untuk endpoint login.

**Spesifikasi API:**
- **Endpoint:** `POST /api/users/login`
- **Request Body:**
  ```json
  {
      "name": "Admin",
      "email": "admin",
      "password": "admin"
  }
  ```
- **Response Body (Success):**
  ```json
  {
      "data": "token-uuid-disini"
  }
  ```
- **Response Body (Failed):**
  ```json
  {
      "error": "Email atau password salah"
  }
  ```

**Tahapan Implementasi:**
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan method HTTP `POST` ke path `/users/login` (karena route ini sudah tergabung dengan prefix `/api`).
3. Tambahkan validasi body menggunakan skema Elysia (`t.Object`) untuk memastikan struktur JSON yang masuk sesuai (memiliki `name`, `email`, dan `password`).
4. Panggil fungsi `loginUser` yang telah dibuat di `user-service.ts`.
5. Apabila login gagal, set HTTP status code ke nilai yang sesuai (misalnya `401 Unauthorized` atau `400 Bad Request`) lalu kembalikan payload error.
6. Jika login berhasil, kembalikan payload success.

---

## Catatan Penting (Best Practice)
- Jangan pernah mengembalikan pesan error yang spesifik (seperti "Email tidak ditemukan" atau "Password salah"). Selalu satukan menjadi "Email atau password salah" demi keamanan agar tidak membuka celah *enumeration attack*.
- Pertahankan **Separation of Concerns**: `users-route.ts` murni untuk menangani HTTP request, validasi body tipe data, dan response. Semua interaksi database dan bisnis logic murni ditangani oleh `user-service.ts`.
- Pastikan kode berjalan dalam mode *Type Safe* menggunakan TypeScript.
