# Instrucciones de Instalación y Uso

## 🚀 Inicio Rápido

### Paso 1: Instalar dependencias

Ejecuta el script de instalación:
```bash
./start.sh
```

O manualmente:
```bash
cd backend && npm install && cd ..
cd frontend && npm install
```

### Paso 2: Configurar MySQL

1. Crea la base de datos:
```sql
CREATE DATABASE inventario_ferreteria;
```

2. Importa el esquema:
```bash
mysql -u root -p inventario_ferreteria < backend/database/schema.sql
```

### Paso 3: Configurar variables de entorno

Crea el archivo `backend/.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=inventario_ferreteria
PORT=5000
NODE_ENV=development
JWT_SECRET=gestor_inventario_secret_key_2024
```

### Paso 4: Ejecutar la aplicación

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Acceder a la aplicación

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## 👤 Credenciales de Prueba

**Administrador:**
- Email: admin@ferreteria.com
- Password: admin123

**Empleado:**
- Email: empleado@ferreteria.com
- Password: empleado123

## 📝 Funcionalidades Implementadas

✅ Sistema de autenticación con JWT
✅ Dashboard con métricas básicas
✅ Listado de productos
✅ Listado de movimientos
✅ API REST completa
✅ Gestión de categorías y proveedores
✅ Alertas de bajo stock

## 🔧 Estructura del Proyecto

```
PROYECTOS_CATEDRA/
├── backend/              # API REST con Express
├── frontend/            # Aplicación React
├── start.sh             # Script de instalación
└── INSTRUCCIONES.md     # Este archivo
```

## ⚠️ Notas Importantes

1. Asegúrate de tener MySQL corriendo
2. Las contraseñas en la BD están hasheadas con bcrypt
3. El token JWT expira en 24 horas
4. Solo los administradores pueden crear/editar/eliminar productos

## 🐛 Solución de Problemas

**Error de conexión a MySQL:**
- Verifica que MySQL esté corriendo
- Revisa las credenciales en `.env`

**Errores de CORS:**
- El backend ya tiene CORS habilitado
- Verifica que el puerto del backend sea 5000

**El frontend no carga:**
- Verifica que el backend esté corriendo
- Abre la consola del navegador para ver errores

