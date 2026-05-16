Buatkan issue.md berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau Ai yang lebih murah

Ini dari planning nya adalah sebagai berikut : 

buat table sessions:
id integer primary key auto increment
token varchar 255 not null (isinya UUID string untuk token user yang login)
user_id integer foreign key reference ke table users id
created_at timestamp default current_timestamp
updated_at timestamp default current_timestamp 

buatkan API untuk login user baru

ENDPOINT : POST /api/users/login
Request Body : 
{
    name : 'Admin',
    email : 'admin',
    password : 'admin'
}

Response Body (Success): 
{
    data : 'token'
}

Response Body (Failed):
{
    error : 'Email atau password salah'
}

Struktur Folder didalam src
- routes : Ini berisi routing elysiajs
- services : Ini berisi logic elysiajs

Struktur file : 
- routes : menggunakan format file users-route.ts
- services : menggunakan format file user-service.ts

jelaskan tahapan yang harus di lakukan untuk mengimplementasikan fitur ini, anggap saja yang mengimlementasikan adalah junior programmer atau model ai yang lebih murah.