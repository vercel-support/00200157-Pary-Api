# Configuración de MongoDB con Prisma

Este README detalla los pasos para configurar MongoDB con Prisma.

## Requisitos

-   Tener instalado [Node.js](https://nodejs.org/)
-   Tener instalado [MongoDB](https://www.mongodb.com/try/download/community)
-   Tener instalado [Prisma](https://www.prisma.io/)

## Crear un usuario en MongoDB

1. Abre tu terminal.

2. Inicia el shell de MongoDB escribiendo `mongo` en la terminal.

3. Ahora, selecciona la base de datos de administración utilizando el comando `use admin`.

4. Finalmente, puedes crear un usuario con el comando `db.createUser()`. Recuerda cambiar `your_password` por la contraseña que desees.

```bash
use admin
db.createUser(
  {
    user: "mereketengue",
    pwd: "CUSTOM_PASSWORD",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
  }
)

yarn prisma generate
yarn prisma db push

yarn dev
```
