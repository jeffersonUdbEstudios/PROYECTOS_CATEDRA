#Gestor de Inventario Web para Ferretería

Sistema web para la gestión de inventario de una ferretería, desarrollado con React (Frontend) y Express + MySQL (Backend).

## Características

- CRUD de productos, categorías, proveedores y usuarios
- Gestión de stock con entrada y salida de productos
- Sistema de usuarios con roles (administrador/empleado)
- Alertas de bajo stock
- Dashboard con métricas
- Diseño responsivo

## Requisitos

- Node.js (v14 o superior)
- MySQL (v5.7 o superior) o Docker
- npm

## Instalación

1. Instalar dependencias del backend:
```bash
cd backend
npm install
```

2. Instalar dependencias del frontend:
```bash
cd ../frontend
npm install
```

3. Configurar MySQL:

   **Opción A - Docker (Recomendado):**
   ```bash
   docker-compose up -d
   ```
   Esto crea la base de datos e importa el esquema automáticamente.

   **Opción B - MySQL Manual:**
   ```bash
   mysql -u root -p -e "CREATE DATABASE inventario_ferreteria;"
   mysql -u root -p inventario_ferreteria < backend/database/schema.sql
   ```

4. Crear archivo `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=inventario_ferreteria
PORT=5001
NODE_ENV=development
JWT_SECRET=gestor_inventario_secret_key_2024
```

## Ejecución

Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm start
```

El frontend estará disponible en: http://localhost:3000
El backend estará disponible en: http://localhost:5001

## Credenciales de Prueba

**Administrador:**
- Correo: admin@ferreteria.com
- Contraseña: admin123

**Empleado:**
- Correo: empleado@ferreteria.com
- Contraseña: empleado123

## Estructura del Proyecto

```
├── backend/
│   ├── config/          # Configuración de BD
│   ├── controllers/     # Controladores API
│   ├── routes/          # Rutas API
│   ├── middleware/      # Middlewares
│   └── server.js        # Servidor Express
├── frontend/
│   ├── src/
│   │   ├── components/  # Componentes React
│   │   ├── pages/       # Páginas
│   │   ├── services/    # Servicios API
│   │   └── App.js
│   └── public/
└── README.md
```

## API Endpoints

- `/api/productos` - Productos
- `/api/categorias` - Categorías
- `/api/proveedores` - Proveedores
- `/api/usuarios` - Usuarios
- `/api/movimientos` - Movimientos de inventario
- `/api/usuarios/login` - Autenticación

## Licencia

MIT

