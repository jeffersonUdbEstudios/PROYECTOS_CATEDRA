const { query } = require('../config/db');

const getAllMovimientos = async (req, res) => {
    try {
        const sql = `
            SELECT m.*, 
                   p.nombre as nombre_producto, 
                   p.codigo as codigo_producto,
                   u.nombre as nombre_usuario
            FROM movimientos m
            INNER JOIN productos p ON m.producto_id = p.id_producto
            INNER JOIN usuarios u ON m.usuario_id = u.id_usuario
            ORDER BY m.fecha_movimiento DESC
        `;

        const movimientos = await query(sql);
        
        res.json({ success: true, data: movimientos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener movimientos', error: error.message });
    }
};

const getMovimientoById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const sql = `
            SELECT m.*, 
                   p.nombre as nombre_producto, 
                   p.codigo as codigo_producto,
                   u.nombre as nombre_usuario
            FROM movimientos m
            INNER JOIN productos p ON m.producto_id = p.id_producto
            INNER JOIN usuarios u ON m.usuario_id = u.id_usuario
            WHERE m.id_movimiento = ?
        `;

        const [movimiento] = await query(sql, [id]);
        
        if (!movimiento) {
            return res.status(404).json({ success: false, message: 'Movimiento no encontrado' });
        }

        res.json({ success: true, data: movimiento });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener movimiento', error: error.message });
    }
};

const createMovimiento = async (req, res) => {
    const connection = await require('../config/db').pool.getConnection();
    
    try {
        await connection.beginTransaction();

        const { producto_id, tipo, cantidad, precio_unitario, motivo, observaciones, usuario_id } = req.body;

        if (!producto_id || !tipo || !cantidad || !usuario_id) {
            return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
        }

        const sql = `
            INSERT INTO movimientos (producto_id, tipo, cantidad, precio_unitario, motivo, usuario_id, observaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        await connection.execute(sql, [
            producto_id, 
            tipo, 
            cantidad, 
            precio_unitario || null, 
            motivo || null, 
            usuario_id, 
            observaciones || null
        ]);

        const updateSql = tipo === 'entrada' 
            ? 'UPDATE productos SET cantidad_actual = cantidad_actual + ? WHERE id_producto = ?'
            : 'UPDATE productos SET cantidad_actual = cantidad_actual - ? WHERE id_producto = ?';

        const [producto] = await connection.execute('SELECT cantidad_actual FROM productos WHERE id_producto = ?', [producto_id]);

        if (tipo === 'salida' && producto[0].cantidad_actual < cantidad) {
            await connection.rollback();
            return res.status(400).json({ success: false, message: 'Stock insuficiente' });
        }

        await connection.execute(updateSql, [cantidad, producto_id]);

        await connection.commit();

        res.status(201).json({ success: true, message: 'Movimiento registrado exitosamente' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ success: false, message: 'Error al registrar movimiento', error: error.message });
    } finally {
        connection.release();
    }
};

const getMovimientosByProducto = async (req, res) => {
    try {
        const { productoId } = req.params;
        
        const sql = `
            SELECT m.*, u.nombre as nombre_usuario
            FROM movimientos m
            INNER JOIN usuarios u ON m.usuario_id = u.id_usuario
            WHERE m.producto_id = ?
            ORDER BY m.fecha_movimiento DESC
        `;

        const movimientos = await query(sql, [productoId]);
        
        res.json({ success: true, data: movimientos });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener movimientos', error: error.message });
    }
};

module.exports = {
    getAllMovimientos,
    getMovimientoById,
    createMovimiento,
    getMovimientosByProducto
};

