# Implementasi Fitur Get Current User

## Deskripsi Tugas
Tugas ini bertujuan untuk mengimplementasikan endpoint API untuk mendapatkan data user yang saat ini sedang login. Fitur ini akan mengecek token yang dikirimkan melalui header `Authorization`, memvalidasinya dengan data di tabel `sessions`, dan jika valid, mengembalikan data profil user tersebut.

---

## Spesifikasi Teknis

### 1. Pembuatan Service Logic (`src/services/user-service.ts`)
Tambahkan fungsi baru untuk mengambil data user berdasarkan token.

**Tahapan Implementasi:**
1. Buka file `src/services/user-service.ts`.
2. Buat fungsi asynchronous baru, misalnya `getCurrentUser(token: string)`.
3. **Pencarian Session & User:** 
   - Lakukan query ke database menggunakan Drizzle ORM.
   - Kamu bisa melakukan join antara tabel `sessions` dan tabel `users` (berdasarkan `userId`), ATAU melakukan query bertahap: cari `userId` di `sessions` berdasarkan `token`, lalu cari data user berdasarkan `userId` tersebut.
4. **Validasi:**
   - Jika session dengan token tersebut tidak ditemukan, segera kembalikan object error: `{ error: 'Unauthorized' }`.
5. **Return Success:**
   - Jika data ditemukan, kembalikan response sukses yang berisi data profil user.
   - **PENTING**: Jangan pernah menyertakan hash `password` di dalam response.
   - Format kembalian: `{ data: { id: user.id, name: user.name, email: user.email } }`.

### 2. Pembuatan Endpoint API (`src/routes/users-route.ts`)
Tambahkan route GET baru untuk mendapatkan data user saat ini.

**Spesifikasi API:**
- **Endpoint:** `GET /api/users/current`
- **Headers:**
  - `Authorization`: `Bearer <token>` (Misal: `Bearer 297b64c6-762e-460f-8954-9283a42345ed`)
- **Response Body (Success) - HTTP Status 200:**
  ```json
  {
      "data": {
          "id": 1,
          "name": "Admin",
          "email": "admin"
      }
  }
  ```
- **Response Body (Failed) - HTTP Status 401:**
  ```json
  {
      "error": "Unauthorized"
  }
  ```

**Tahapan Implementasi:**
1. Buka file `src/routes/users-route.ts`.
2. Tambahkan method HTTP `.get('/users/current', ...)` pada instance Elysia (di dalam prefix `/api`).
3. Di dalam handler tersebut:
   - Ambil nilai dari header `authorization` (pada Elysia tersedia melalui object `headers`).
   - Ekstrak nilai token-nya. Biasanya formatnya adalah `Bearer <token>`. Jika header `authorization` tidak ada atau formatnya salah, langsung set `set.status = 401` dan kembalikan `{ error: 'Unauthorized' }`.
   - Panggil fungsi `getCurrentUser(token)` dari `user-service.ts`.
4. Jika service mereturn error (token tidak ada di DB), set `set.status = 401` dan return error tersebut.
5. Jika berhasil, return hasil datanya.

---

## Catatan Tambahan (Best Practice)
- **Keamanan:** Selalu berhati-hati agar informasi sensitif seperti *password hash* tidak terekspos di response payload.
- **Separation of Concerns:** Pastikan `users-route.ts` hanya bertugas membaca request header dan mengirimkan response. Logika pencarian data di database sepenuhnya dikelola oleh `user-service.ts`.
- Terapkan tipe data dengan ketat menggunakan TypeScript.
