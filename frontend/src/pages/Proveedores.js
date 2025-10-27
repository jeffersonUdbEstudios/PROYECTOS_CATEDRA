import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProveedorModal from '../components/ProveedorModal';
import { proveedoresService } from '../services/api';
import './Proveedores.css';

const Proveedores = ({ user, onLogout }) => {
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);

  useEffect(() => {
    loadProveedores();
  }, []);

  const loadProveedores = async () => {
    try {
      const result = await proveedoresService.getAll();
      setProveedores(result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar proveedores', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedProveedor(null);
    setShowModal(true);
  };

  const handleEdit = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedProveedor) {
        await proveedoresService.update(selectedProveedor.id_proveedor, data);
      } else {
        await proveedoresService.create(data);
      }
      setShowModal(false);
      await loadProveedores();
    } catch (error) {
      console.error('Error al guardar proveedor', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este proveedor?')) {
      try {
        await proveedoresService.delete(id);
        alert('Proveedor eliminado exitosamente');
        loadProveedores();
      } catch (error) {
        console.error('Error al eliminar proveedor', error);
        alert('Error al eliminar proveedor: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  return (
    <div className="app-container">
      <Navbar user={user} onLogout={onLogout} />
      <div className="main-layout">
        <Sidebar user={user} />
        <main className="main-content">
          <div className="page-header">
            <h1>Proveedores</h1>
            <button onClick={handleCreate} className="btn-primary">
              + Nuevo Proveedor
            </button>
          </div>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Contacto</th>
                    <th>Teléfono</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {proveedores.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                        No hay proveedores registrados
                      </td>
                    </tr>
                  ) : (
                    proveedores.map(proveedor => (
                      <tr key={proveedor.id_proveedor}>
                        <td>{proveedor.id_proveedor}</td>
                        <td>{proveedor.nombre}</td>
                        <td>{proveedor.contacto || 'N/A'}</td>
                        <td>{proveedor.telefono || 'N/A'}</td>
                        <td>{proveedor.email || 'N/A'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleEdit(proveedor)} className="btn-sm btn-edit">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(proveedor.id_proveedor)} className="btn-sm btn-delete">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {showModal && (
            <ProveedorModal
              proveedor={selectedProveedor}
              onClose={() => setShowModal(false)}
              onSave={handleSave}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Proveedores;

