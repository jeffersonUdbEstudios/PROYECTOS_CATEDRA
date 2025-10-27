import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { productosService, movimientosService } from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    bajoStock: 0,
    valorTotal: 0,
    totalMovimientos: 0
  });
  const [productosBajoStock, setProductosBajoStock] = useState([]);
  const [movimientosRecientes, setMovimientosRecientes] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [productos, bajoStock, movimientos] = await Promise.all([
        productosService.getAll(),
        productosService.getBajoStock(),
        movimientosService.getAll()
      ]);
      
      const totalProductos = productos.data?.length || 0;
      const bajoStockData = bajoStock.data || [];
      
      const valorTotal = productos.data?.reduce((sum, p) => {
        return sum + (parseFloat(p.precio_unitario) * parseInt(p.cantidad_actual));
      }, 0) || 0;

      const movimientosData = movimientos.data?.slice(0, 10) || [];

      setStats({
        totalProductos,
        bajoStock: bajoStockData.length,
        valorTotal: valorTotal.toFixed(2),
        totalMovimientos: movimientos.data?.length || 0
      });
      
      setProductosBajoStock(bajoStockData);
      setMovimientosRecientes(movimientosData);
    } catch (error) {
      console.error('Error al cargar dashboard', error);
    }
  };

  const exportToJSON = () => {
    const data = {
      fecha: new Date().toISOString(),
      estadisticas: stats,
      productosBajoStock: productosBajoStock,
      movimientosRecientes: movimientosRecientes
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-inventario-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <div className="dashboard-header">
            <h1>Dashboard</h1>
            <button onClick={exportToJSON} className="btn-export">
              📊 Exportar Reporte
            </button>
          </div>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <h3>{stats.totalProductos}</h3>
                <p>Total de Productos</p>
              </div>
            </div>
            
            <div className="stat-card warning">
              <div className="stat-icon">⚠️</div>
              <div className="stat-info">
                <h3>{stats.bajoStock}</h3>
                <p>Productos con Bajo Stock</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-info">
                <h3>${stats.valorTotal}</h3>
                <p>Valor Total del Inventario</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🔄</div>
              <div className="stat-info">
                <h3>{stats.totalMovimientos}</h3>
                <p>Movimientos Registrados</p>
              </div>
            </div>
          </div>

          {productosBajoStock.length > 0 && (
            <div className="alert-section">
              <div className="alert-header">
                <h2>⚠️ Alertas de Bajo Stock</h2>
              </div>
              <div className="alert-list">
                {productosBajoStock.map(producto => (
                  <div key={producto.id_producto} className="alert-item">
                    <div className="alert-product">
                      <strong>{producto.nombre}</strong>
                      <span className="alert-codigo">{producto.codigo}</span>
                    </div>
                    <div className="alert-stock">
                      <span className="stock-actual">Stock: {producto.cantidad_actual}</span>
                      <span className="stock-minimo">Mínimo: {producto.stock_minimo}</span>
                      <span className="stock-diferencia">Diferencia: {parseInt(producto.cantidad_actual) - parseInt(producto.stock_minimo)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="report-section">
            <h2>Movimientos Recientes</h2>
            <div className="movimientos-table-container">
              <table className="movimientos-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosRecientes.map(mov => (
                    <tr key={mov.id_movimiento}>
                      <td>{new Date(mov.fecha_movimiento).toLocaleString('es-ES')}</td>
                      <td>{mov.nombre_producto}</td>
                      <td>
                        <span className={`badge ${mov.tipo === 'entrada' ? 'success' : 'danger'}`}>
                          {mov.tipo === 'entrada' ? '➕ Entrada' : '➖ Salida'}
                        </span>
                      </td>
                      <td>{mov.cantidad}</td>
                    </tr>
                  ))}
                  {movimientosRecientes.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        No hay movimientos recientes
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

