Buatkan issue.md berisi perencanaan untuk nanti di implementasikan oleh junior programmer atau Ai yang lebih murah

Ini dari planning nya adalah sebagai berikut : 

buatkan API untuk get users saat ini yang sedang login baru

ENDPOINT : GET /api/users/current

HEADERS : 
Authorization : Bearer <token> (token adalah token yang ada di table sessions nya)

Response Body (Success): 
{
    data : {
        id : 1,
        name : 'Admin',
        email : 'admin'
    }
}

Response Body (Failed):
{
    error : 'Unauthorized'
}

Struktur Folder didalam src
- routes : Ini berisi routing elysiajs
- services : Ini berisi logic elysiajs

Struktur file : 
- routes : menggunakan format file users-route.ts
- services : menggunakan format file user-service.ts

jelaskan tahapan yang harus di lakukan untuk mengimplementasikan fitur ini, anggap saja yang mengimlementasikan adalah junior programmer atau model ai yang lebih murah.