# Sistema Web de Veterinaria

Aplicación web para la gestión de mascotas, citas, historiales clínicos, usuarios y vacunas.

El proyecto está dividido en:

- `frontend/`: aplicación Angular.
- `backend/`: API REST construida con Node.js y Express.
- MySQL: base de datos utilizada por el backend.

## Requisitos

- Node.js y npm.
- MySQL Server.
- Una base de datos MySQL configurada para el proyecto.

## Instalación

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Sistema-Web-de-Veterinaria
```

Instala las dependencias de cada parte:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configuración del backend

Crea el archivo `backend/.env` con las credenciales de MySQL y la clave usada para firmar los tokens JWT:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=nombre_de_la_base_de_datos
JWT_SECRET=una_clave_segura
PORT=3000
```

Asegúrate de que la base de datos indicada en `DB_NAME` exista y contenga las tablas necesarias para la aplicación.

## Ejecución en desarrollo

Abre dos terminales desde la raíz del proyecto.

### Backend

```bash
cd backend
npm run dev
```

La API quedará disponible en:

```text
http://localhost:3000
```

También puedes iniciarla sin `nodemon` con:

```bash
node index.js
```

### Frontend

En la segunda terminal:

```bash
cd frontend
npm start
```

Abre la aplicación en:

```text
http://localhost:4200
```

El frontend utiliza la API del backend en `http://localhost:3000`.

## Rutas principales del frontend

- `/login`: inicio de sesión.
- `/registro`: registro de usuarios.
- `/app/dashboard`: panel principal, requiere autenticación.
- `/app/perfil`: perfil del usuario.
- `/app/mascotas-list`: listado de mascotas.
- `/app/mascotas-form`: registro de mascotas.
- `/app/cita-list`: gestión de citas.
- `/app/historial-list/:id`: historial clínico de una mascota.
- `/app/historial-form`: creación de historiales clínicos.
- `/app/vacunas-list`: gestión de vacunas.
- `/app/usuarios-list`: gestión de usuarios, disponible para administradores.

Las rutas protegidas requieren iniciar sesión. Algunas funciones dependen del rol del usuario: `cliente`, `veterinario` o `admin`.

## Endpoints principales de la API

- `GET /test-db`: comprueba la conexión con la base de datos.
- `/api/usuarios`: autenticación, registro y perfil.
- `/api/mascotas`: gestión de mascotas.
- `/api/citas`: gestión de citas.
- `/api/historial`: gestión de historiales clínicos.
- `/api/vacunas`: gestión de vacunas.

## Comandos útiles

Desde `frontend/`:

```bash
npm run build
npm test
```

Desde `backend/`:

```bash
npm run dev
```

## Estructura resumida

```text
Sistema-Web-de-Veterinaria/
├── backend/
│   ├── index.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── models/
│       └── routes/
├── frontend/
│   └── src/app/
│       ├── components/
│       ├── guards/
│       ├── interceptors/
│       ├── layouts/
│       ├── pages/
│       └── services/
└── README.md
```
