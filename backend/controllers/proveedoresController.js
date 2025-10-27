/**
 * Controlador para Proveedores
 */

const { query } = require('../config/db');

// Obtener todos los proveedores
const getAllProveedores = async (req, res) => {
    try {
        const sql = 'SELECT * FROM proveedores ORDER BY nombre ASC';
        const proveedores = await query(sql);
        
        res.json({
            success: true,
            data: proveedores
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proveedores',
            error: error.message
        });
    }
};

// Obtener un proveedor por ID
const getProveedorById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM proveedores WHERE id_proveedor = ?';
        const [proveedor] = await query(sql, [id]);
        
        if (!proveedor) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        res.json({
            success: true,
            data: proveedor
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener proveedor',
            error: error.message
        });
    }
};

// Crear un nuevo proveedor
const createProveedor = async (req, res) => {
    try {
        const { nombre, contacto, telefono, email, direccion } = req.body;

        if (!nombre) {
            return res.status(400).json({
                success: false,
                message: 'El nombre del proveedor es requerido'
            });
        }

        const sql = `
            INSERT INTO proveedores (nombre, contacto, telefono, email, direccion) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        const result = await query(sql, [nombre, contacto, telefono, email, direccion]);

        res.status(201).json({
            success: true,
            message: 'Proveedor creado exitosamente',
            data: { id_proveedor: result.insertId }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear proveedor',
            error: error.message
        });
    }
};

// Actualizar un proveedor
const updateProveedor = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, contacto, telefono, email, direccion } = req.body;

        const sql = `
            UPDATE proveedores 
            SET nombre = ?, contacto = ?, telefono = ?, email = ?, direccion = ?
            WHERE id_proveedor = ?
        `;
        
        const result = await query(sql, [nombre, contacto, telefono, email, direccion, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Proveedor actualizado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar proveedor',
            error: error.message
        });
    }
};

// Eliminar un proveedor
const deleteProveedor = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay productos usando este proveedor
        const checkSql = 'SELECT COUNT(*) as count FROM productos WHERE proveedor_id = ?';
        const [result] = await query(checkSql, [id]);

        if (result.count > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar el proveedor porque tiene productos asociados'
            });
        }

        const sql = 'DELETE FROM proveedores WHERE id_proveedor = ?';
        const deleteResult = await query(sql, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        res.json({
            success: true,
            message: 'Proveedor eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar proveedor',
            error: error.message
        });
    }
};

module.exports = {
    getAllProveedores,
    getProveedorById,
    createProveedor,
    updateProveedor,
    deleteProveedor
};

