const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');

router.get('/', productosController.getAllProductos);
router.get('/bajo-stock', productosController.getProductosBajoStock);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.createProducto);
router.put('/:id', productosController.updateProducto);
router.delete('/:id', productosController.deleteProducto);

module.exports = router;

