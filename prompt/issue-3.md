Buatkan issue.md berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau Ai yang lebih murah

Ini dari planning nya adalah sebagai berikut : 

buat table users:
id integer primary key auto increment
name varchar 255 not null
email varchar 255 not null unique
password varchar 255 not null (password merupakan hash dari bycrpt)
created_at timestamp default current_timestamp
updated_at timestamp default current_timestamp 

buatkan API untuk registrasi user baru

ENDPOINT : POST /api/users
Request Body : 
{
    name : 'Admin',
    email : 'admin',
    password : 'admin'
}
Response Body (Success): 
{
    data : 'OK'
}

Response Body (Failed):
{
    error : 'Email sudah terdaftar'
}

Struktur Folder didalam src
- routes : Ini berisi routing elysiajs
- services : Ini berisi logic elysiajs

Struktur file : 
- routes : menggunakan format file users-route.ts
- services : menggunakan format file user-service.ts

jelaskan tahapan yang harus di lakukan untuk mengimplementasikan fitur ini, anggap saja yang mengimlementasikan adalah junior programmer atau model ai yang lebih murah.