import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CategoriaModal from '../components/CategoriaModal';
import { categoriasService } from '../services/api';
import './Categorias.css';

const Categorias = ({ user, onLogout }) => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState(null);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const result = await categoriasService.getAll();
      setCategorias(result.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar categorías', error);
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedCategoria(null);
    setShowModal(true);
  };

  const handleEdit = (categoria) => {
    setSelectedCategoria(categoria);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      if (selectedCategoria) {
        await categoriasService.update(selectedCategoria.id_categoria, data);
      } else {
        await categoriasService.create(data);
      }
      setShowModal(false);
      await loadCategorias();
    } catch (error) {
      console.error('Error al guardar categoría', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar esta categoría?')) {
      try {
        await categoriasService.delete(id);
        alert('Categoría eliminada exitosamente');
        loadCategorias();
      } catch (error) {
        console.error('Error al eliminar categoría', error);
        alert('Error al eliminar categoría: ' + (error.response?.data?.message || error.message));
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
            <h1>Categorías</h1>
            <button onClick={handleCreate} className="btn-primary">
              + Nueva Categoría
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
                    <th>Nombre de Categoría</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.length === 0 ? (
                    <tr>
                      <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                        No hay categorías registradas
                      </td>
                    </tr>
                  ) : (
                    categorias.map(categoria => (
                      <tr key={categoria.id_categoria}>
                        <td>{categoria.id_categoria}</td>
                        <td>{categoria.nombre_categoria}</td>
                        <td>{categoria.descripcion || 'Sin descripción'}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleEdit(categoria)} className="btn-sm btn-edit">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(categoria.id_categoria)} className="btn-sm btn-delete">
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
            <CategoriaModal
              categoria={selectedCategoria}
              onClose={() => setShowModal(false)}
              onSave={handleSave}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Categorias;

