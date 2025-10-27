import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { movimientosService } from '../services/api';
import './Movimientos.css';

const Movimientos = ({ user, onLogout }) => {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState('todos');

  useEffect(() => {
    loadMovimientos();
  }, []);

  const loadMovimientos = async () => {
    try {
      const result = await movimientosService.getAll();
      setMovimientos(result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar movimientos', error);
      setLoading(false);
    }
  };

  const movimientosFiltrados = filtroTipo === 'todos' 
    ? movimientos 
    : movimientos.filter(m => m.tipo === filtroTipo);

  const entradas = movimientos.filter(m => m.tipo === 'entrada').length;
  const salidas = movimientos.filter(m => m.tipo === 'salida').length;

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <div className="page-header">
            <h1>Movimientos de Inventario</h1>
            <div className="filtros">
              <button 
                className={filtroTipo === 'todos' ? 'btn-filter active' : 'btn-filter'}
                onClick={() => setFiltroTipo('todos')}
              >
                Todos
              </button>
              <button 
                className={filtroTipo === 'entrada' ? 'btn-filter active' : 'btn-filter'}
                onClick={() => setFiltroTipo('entrada')}
              >
                ➕ Entradas
              </button>
              <button 
                className={filtroTipo === 'salida' ? 'btn-filter active' : 'btn-filter'}
                onClick={() => setFiltroTipo('salida')}
              >
                ➖ Salidas
              </button>
            </div>
          </div>

          <div className="stats-movimientos">
            <div className="stat-mov">
              <span className="stat-label">Total Entradas:</span>
              <span className="stat-value">{entradas}</span>
            </div>
            <div className="stat-mov">
              <span className="stat-label">Total Salidas:</span>
              <span className="stat-value">{salidas}</span>
            </div>
            <div className="stat-mov">
              <span className="stat-label">Total Movimientos:</span>
              <span className="stat-value">{movimientos.length}</span>
            </div>
          </div>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="table-container">
              <table className="movimientos-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Usuario</th>
                  </tr>
                </thead>
                <tbody>
                  {movimientosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        No hay movimientos para mostrar
                      </td>
                    </tr>
                  ) : (
                    movimientosFiltrados.map(movimiento => (
                      <tr key={movimiento.id_movimiento}>
                        <td>{new Date(movimiento.fecha_movimiento).toLocaleString('es-ES')}</td>
                        <td>{movimiento.nombre_producto}</td>
                        <td className="codigo-cell">{movimiento.codigo_producto || 'N/A'}</td>
                        <td>
                          <span className={`badge ${movimiento.tipo === 'entrada' ? 'success' : 'danger'}`}>
                            {movimiento.tipo === 'entrada' ? '➕ Entrada' : '➖ Salida'}
                          </span>
                        </td>
                        <td>{movimiento.cantidad}</td>
                        <td>{movimiento.nombre_usuario}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Movimientos;

