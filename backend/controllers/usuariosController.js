const { query } = require('../config/db');
const bcrypt = require('bcryptjs');

const getAllUsuarios = async (req, res) => {
    try {
        const sql = 'SELECT id_usuario, nombre, correo, rol, estado, fecha_creacion FROM usuarios ORDER BY nombre ASC';
        const usuarios = await query(sql);
        
        res.json({ success: true, data: usuarios });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuarios', error: error.message });
    }
};

const getUsuarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const sql = 'SELECT id_usuario, nombre, correo, rol, estado, fecha_creacion FROM usuarios WHERE id_usuario = ?';
        const [usuario] = await query(sql, [id]);
        
        if (!usuario) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, data: usuario });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al obtener usuario', error: error.message });
    }
};

const createUsuario = async (req, res) => {
    try {
        const { nombre, correo, contrasena, rol } = req.body;

        if (!nombre || !correo || !contrasena) {
            return res.status(400).json({ success: false, message: 'Faltan campos requeridos' });
        }

        const hashedPassword = await bcrypt.hash(contrasena, 10);
        const sql = 'INSERT INTO usuarios (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)';
        const result = await query(sql, [nombre, correo, hashedPassword, rol || 'empleado']);

        res.status(201).json({
            success: true,
            message: 'Usuario creado exitosamente',
            data: { id_usuario: result.insertId }
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, message: 'Ya existe un usuario con ese correo' });
        }
        res.status(500).json({ success: false, message: 'Error al crear usuario', error: error.message });
    }
};

const updateUsuario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, correo, rol, estado } = req.body;

        const sql = 'UPDATE usuarios SET nombre = ?, correo = ?, rol = ?, estado = ? WHERE id_usuario = ?';
        const result = await query(sql, [nombre, correo, rol, estado, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar usuario', error: error.message });
    }
};

const deleteUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const sql = 'DELETE FROM usuarios WHERE id_usuario = ?';
        const result = await query(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }

        res.json({ success: true, message: 'Usuario eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al eliminar usuario', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        if (!correo || !contrasena) {
            return res.status(400).json({ success: false, message: 'Correo y contraseña son requeridos' });
        }

        const sql = 'SELECT * FROM usuarios WHERE correo = ? AND estado = "activo"';
        const [usuario] = await query(sql, [correo]);

        if (!usuario) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const validPassword = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!validPassword) {
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        res.json({
            success: true,
            message: 'Login exitoso',
            data: {
                usuario: {
                    id_usuario: usuario.id_usuario,
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    rol: usuario.rol
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error en login', error: error.message });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    login
};

