/**
 * Middleware de autenticación
 */

const jwt = require('jsonwebtoken');

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token no proporcionado' 
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            success: false, 
            message: 'Token inválido' 
        });
    }
};

// Middleware para verificar rol
const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Usuario no autenticado' 
            });
        }

        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                success: false, 
                message: 'No tienes permisos para esta acción' 
            });
        }

        next();
    };
};

module.exports = { verifyToken, checkRole };

