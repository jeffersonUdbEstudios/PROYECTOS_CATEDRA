# Solución al Problema de Login

## 🔴 Problema Actual:
- La página de login se recarga y no avanza al dashboard
- Google Password Manager muestra alerta

## ✅ Solución:

### 1. Verificar que el Backend esté corriendo:
```bash
# En una terminal
cd backend
npm start
```

Deberías ver: "Servidor corriendo en puerto 5001"

### 2. Credenciales Correctas:

**Administrador:**
- Correo: `admin@ferreteria.com` (COMPLETO, no "ado@ferreteria.com")
- Contraseña: `admin123`

**Empleado:**
- Correo: `empleado@ferreteria.com`
- Contraseña: `empleado123`

### 3. Pasos para hacer Login:

1. Abre el navegador en: http://localhost:3000
2. Cierra la alerta de Google (click en "OK")
3. Escribe CORRECTAMENTE el email: `admin@ferreteria.com`
4. Escribe la contraseña: `admin123`
5. Click en "Iniciar Sesión"

### 4. Si sigue sin funcionar:

Abre la consola del navegador (F12) y revisa:
- Mensajes que empiecen con "Intentando login con:"
- Errores en rojo

Errores comunes:
- "Network Error" → El backend no está corriendo
- "Request failed" → Verifica que MySQL esté corriendo
- "Invalid credentials" → Las contraseñas no coinciden (reinicia el backend)

### 5. Reiniciar Backend para generar contraseñas correctas:

```bash
# Detener el backend actual (Ctrl+C)
# Luego reiniciar:
cd backend
npm start
```

Esto regenerará las contraseñas con hashes correctos.

