/**
 * Controlador para Categorías
 */

const { query } = require('../config/db');

// Obtener todas las categorías
const getAllCategorias = async (req, res) => {
    try {
        const sql = 'SELECT * FROM categorias ORDER BY nombre_categoria ASC';
        const categorias = await query(sql);
        
        res.json({
            success: true,
            data: categorias
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categorías',
            error: error.message
        });
    }
};

// Obtener una categoría por ID
const getCategoriaById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT * FROM categorias WHERE id_categoria = ?';
        const [categoria] = await query(sql, [id]);
        
        if (!categoria) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            data: categoria
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener categoría',
            error: error.message
        });
    }
};

// Crear una nueva categoría
const createCategoria = async (req, res) => {
    try {
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria) {
            return res.status(400).json({
                success: false,
                message: 'El nombre de la categoría es requerido'
            });
        }

        const sql = 'INSERT INTO categorias (nombre_categoria, descripcion) VALUES (?, ?)';
        const result = await query(sql, [nombre_categoria, descripcion]);

        res.status(201).json({
            success: true,
            message: 'Categoría creada exitosamente',
            data: { id_categoria: result.insertId }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({
                success: false,
                message: 'Ya existe una categoría con ese nombre'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Error al crear categoría',
            error: error.message
        });
    }
};

// Actualizar una categoría
const updateCategoria = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion } = req.body;

        const sql = 'UPDATE categorias SET nombre_categoria = ?, descripcion = ? WHERE id_categoria = ?';
        const result = await query(sql, [nombre_categoria, descripcion, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Categoría actualizada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar categoría',
            error: error.message
        });
    }
};

// Eliminar una categoría
const deleteCategoria = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar si hay productos usando esta categoría
        const checkSql = 'SELECT COUNT(*) as count FROM productos WHERE categoria_id = ?';
        const [result] = await query(checkSql, [id]);

        if (result.count > 0) {
            return res.status(400).json({
                success: false,
                message: 'No se puede eliminar la categoría porque tiene productos asociados'
            });
        }

        const sql = 'DELETE FROM categorias WHERE id_categoria = ?';
        const deleteResult = await query(sql, [id]);

        if (deleteResult.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Categoría no encontrada'
            });
        }

        res.json({
            success: true,
            message: 'Categoría eliminada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar categoría',
            error: error.message
        });
    }
};

module.exports = {
    getAllCategorias,
    getCategoriaById,
    createCategoria,
    updateCategoria,
    deleteCategoria
};

