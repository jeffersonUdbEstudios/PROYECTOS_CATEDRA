const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/db');
const { initData } = require('./config/initData');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/productos', require('./routes/productos'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/proveedores', require('./routes/proveedores'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/movimientos', require('./routes/movimientos'));

app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = await testConnection();
        res.json({ status: dbStatus ? 'online' : 'offline' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
    try {
        await initData();
    } catch (error) {
        console.error('Error inicializando datos:', error);
    }
});

module.exports = app;

