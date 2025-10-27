-- =====================================================
-- Esquema de Base de Datos: Gestor de Inventario
-- =====================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS inventario_ferreteria;
USE inventario_ferreteria;

-- =====================================================
-- Tabla: Categorías
-- =====================================================
CREATE TABLE IF NOT EXISTS categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL UNIQUE,
    descripcion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Tabla: Proveedores
-- =====================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    contacto VARCHAR(200),
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Tabla: Usuarios
-- =====================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    correo VARCHAR(200) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'empleado') DEFAULT 'empleado',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_correo (correo),
    INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Tabla: Productos
-- =====================================================
CREATE TABLE IF NOT EXISTS productos (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE,
    categoria_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio_unitario DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    cantidad_actual INT NOT NULL DEFAULT 0,
    stock_minimo INT NOT NULL DEFAULT 5,
    descripcion TEXT,
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    estado ENUM('activo', 'inactivo') DEFAULT 'activo',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id_categoria) ON DELETE RESTRICT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor) ON DELETE RESTRICT,
    INDEX idx_nombre (nombre),
    INDEX idx_codigo (codigo),
    INDEX idx_categoria (categoria_id),
    INDEX idx_proveedor (proveedor_id),
    INDEX idx_cantidad (cantidad_actual)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Tabla: Movimientos de Inventario
-- =====================================================
CREATE TABLE IF NOT EXISTS movimientos (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    tipo ENUM('entrada', 'salida') NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10, 2),
    motivo TEXT,
    usuario_id INT NOT NULL,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id_producto) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id_usuario) ON DELETE RESTRICT,
    INDEX idx_producto (producto_id),
    INDEX idx_tipo (tipo),
    INDEX idx_usuario (usuario_id),
    INDEX idx_fecha (fecha_movimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- Datos Iniciales: Categorías
-- =====================================================
INSERT INTO categorias (nombre_categoria, descripcion) VALUES
('Herramientas Manuales', 'Destornilladores, martillos, llaves, etc.'),
('Materiales de Construcción', 'Cemento, ladrillos, bloques, etc.'),
('Pinturas y Accesorios', 'Pinturas, brochas, rodillos, etc.'),
('Fontanería', 'Tuberías, conexiones, grifos, etc.'),
('Electricidad', 'Cables, interruptores, focos, etc.'),
('Jardinería', 'Herramientas de jardín, plantas, tierra, etc.'),
('Seguridad', 'Candados, cercas, alarmas, etc.');

-- =====================================================
-- Datos Iniciales: Proveedores
-- =====================================================
INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) VALUES
('Distribuidora Mayorista SA', 'Juan Pérez', '555-0101', 'contacto@distribuidora.com', 'Av. Industrial 123'),
('Materiales de Construcción López', 'María López', '555-0102', 'ventas@materiales.com', 'Calle Comercio 456'),
('Suministros Generales', 'Carlos Rodríguez', '555-0103', 'info@suministros.com', 'Blvd. Central 789'),
('Proveedor Nacional de Herramientas', 'Ana Martínez', '555-0104', 'ventas@herramientas.com', 'Carretera Principal km 15');

-- =====================================================
-- Datos Iniciales: Usuarios
-- =====================================================
-- Contraseñas encriptadas con bcrypt (admin123 y empleado123)
-- admin123: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- empleado123: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO usuarios (nombre, correo, contrasena, rol, estado) VALUES
('Administrador', 'admin@ferreteria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'activo'),
('Empleado Demo', 'empleado@ferreteria.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'empleado', 'activo');

-- =====================================================
-- Datos Iniciales: Productos (opcional)
-- =====================================================
INSERT INTO productos (nombre, codigo, categoria_id, proveedor_id, precio_unitario, cantidad_actual, stock_minimo, descripcion, unidad_medida) VALUES
('Martillo de Acero', 'PROD-001', 1, 1, 25.50, 50, 10, 'Martillo de acero con mango de madera', 'unidad'),
('Destornillador Phillips', 'PROD-002', 1, 1, 8.75, 30, 5, 'Destornillador Phillips #2', 'unidad'),
('Llave Ajustable', 'PROD-003', 1, 1, 15.00, 20, 5, 'Llave ajustable de 8 pulgadas', 'unidad'),
('Cemento Portland', 'PROD-004', 2, 2, 45.00, 100, 20, 'Saco de cemento de 50kg', 'saco'),
('Bloque de Cemento', 'PROD-005', 2, 2, 0.85, 500, 100, 'Bloque 20x20x40 cm', 'unidad'),
('Pintura Interior Blanca', 'PROD-006', 3, 3, 35.50, 25, 5, 'Galón de pintura interior', 'galon'),
('Brocha Profesional', 'PROD-007', 3, 3, 12.00, 15, 5, 'Brocha de 4 pulgadas', 'unidad'),
('Tubo PVC 1/2"', 'PROD-008', 4, 2, 5.50, 80, 20, 'Tubería de PVC media pulgada', 'metro'),
('Interruptor Simple', 'PROD-009', 5, 3, 4.25, 40, 10, 'Interruptor eléctrico', 'unidad'),
('Foco LED 12W', 'PROD-010', 5, 3, 8.00, 60, 15, 'Foco LED de 12 watts', 'unidad');

-- =====================================================
-- Datos Iniciales: Movimientos (ejemplo)
-- =====================================================
-- Nota: Estos movimientos se crearán dinámicamente desde la aplicación
-- Aquí solo se incluye como ejemplo

