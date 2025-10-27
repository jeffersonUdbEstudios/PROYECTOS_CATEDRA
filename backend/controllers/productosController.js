/**
 * Controlador para Productos
 */

const { query } = require('../config/db');
const { pool } = require('../config/db');

// Obtener todos los productos
const getAllProductos = async (req, res) => {
    try {
        let sql = `
            SELECT p.*, 
                   c.nombre_categoria, 
                   pr.nombre as nombre_proveedor
            FROM productos p
            INNER JOIN categorias c ON p.categoria_id = c.id_categoria
            INNER JOIN proveedores pr ON p.proveedor_id = pr.id_proveedor
            WHERE p.estado = 'activo'
            ORDER BY p.fecha_creacion DESC
        `;

        const productos = await query(sql);
        
        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos',
            error: error.message
        });
    }
};

// Obtener un producto por ID
const getProductoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sql = `
            SELECT p.*, 
                   c.nombre_categoria, 
                   pr.nombre as nombre_proveedor
            FROM productos p
            INNER JOIN categorias c ON p.categoria_id = c.id_categoria
            INNER JOIN proveedores pr ON p.proveedor_id = pr.id_proveedor
            WHERE p.id_producto = ?
        `;

        const [producto] = await query(sql, [id]);
        
        if (!producto) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            data: producto
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener producto',
            error: error.message
        });
    }
};

// Crear un nuevo producto
const createProducto = async (req, res) => {
    try {
        const {
            nombre,
            codigo,
            categoria_id,
            proveedor_id,
            precio_unitario,
            cantidad_actual,
            stock_minimo,
            descripcion,
            unidad_medida
        } = req.body;

        // Validaciones
        if (!nombre || !categoria_id || !proveedor_id || !precio_unitario) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos'
            });
        }

        const sql = `
            INSERT INTO productos (
                nombre, codigo, categoria_id, proveedor_id, 
                precio_unitario, cantidad_actual, stock_minimo, 
                descripcion, unidad_medida
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const result = await query(sql, [
            nombre, 
            codigo || null, 
            categoria_id, 
            proveedor_id,
            precio_unitario, 
            cantidad_actual || 0, 
            stock_minimo || 5,
            descripcion || null, 
            unidad_medida || 'unidad'
        ]);

        res.status(201).json({
            success: true,
            message: 'Producto creado exitosamente',
            data: { id_producto: result.insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear producto',
            error: error.message
        });
    }
};

// Actualizar un producto
const updateProducto = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            nombre,
            codigo,
            categoria_id,
            proveedor_id,
            precio_unitario,
            cantidad_actual,
            stock_minimo,
            descripcion,
            unidad_medida,
            estado
        } = req.body;

        const sql = `
            UPDATE productos 
            SET nombre = ?, codigo = ?, categoria_id = ?, proveedor_id = ?,
                precio_unitario = ?, cantidad_actual = ?, stock_minimo = ?,
                descripcion = ?, unidad_medida = ?, estado = ?
            WHERE id_producto = ?
        `;

        const result = await query(sql, [
            nombre, 
            codigo || null, 
            categoria_id, 
            proveedor_id,
            precio_unitario, 
            cantidad_actual || 0, 
            stock_minimo,
            descripcion || null, 
            unidad_medida || 'unidad', 
            estado || 'activo', 
            id
        ]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto actualizado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar producto',
            error: error.message
        });
    }
};

// Eliminar un producto (soft delete)
const deleteProducto = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = `
            UPDATE productos 
            SET estado = 'inactivo' 
            WHERE id_producto = ?
        `;

        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Producto eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar producto',
            error: error.message
        });
    }
};

// Obtener productos con bajo stock
const getProductosBajoStock = async (req, res) => {
    try {
        const sql = `
            SELECT p.*, 
                   c.nombre_categoria, 
                   pr.nombre as nombre_proveedor,
                   (p.stock_minimo - p.cantidad_actual) as diferencia
            FROM productos p
            INNER JOIN categorias c ON p.categoria_id = c.id_categoria
            INNER JOIN proveedores pr ON p.proveedor_id = pr.id_proveedor
            WHERE p.cantidad_actual <= p.stock_minimo AND p.estado = 'activo'
            ORDER BY diferencia ASC
        `;

        const productos = await query(sql);
        
        res.json({
            success: true,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener productos con bajo stock',
            error: error.message
        });
    }
};

module.exports = {
    getAllProductos,
    getProductoById,
    createProducto,
    updateProducto,
    deleteProducto,
    getProductosBajoStock
};

