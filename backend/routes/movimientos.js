const express = require('express');
const router = express.Router();
const movimientosController = require('../controllers/movimientosController');

router.get('/', movimientosController.getAllMovimientos);
router.get('/producto/:productoId', movimientosController.getMovimientosByProducto);
router.get('/:id', movimientosController.getMovimientoById);
router.post('/', movimientosController.createMovimiento);

module.exports = router;

