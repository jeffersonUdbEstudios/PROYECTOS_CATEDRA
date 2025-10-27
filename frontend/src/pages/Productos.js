import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ProductoModal from '../components/ProductoModal';
import StockModal from '../components/StockModal';
import { productosService, categoriasService, proveedoresService, movimientosService } from '../services/api';
import './Productos.css';

const Productos = ({ user, onLogout }) => {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState(null);
  
  const [filtros, setFiltros] = useState({
    busqueda: '',
    categoria: '',
    proveedor: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    aplicarFiltros();
  }, [filtros, productos]);

  const loadData = async () => {
    try {
      const [productosData, categoriasData, proveedoresData] = await Promise.all([
        productosService.getAll(),
        categoriasService.getAll(),
        proveedoresService.getAll()
      ]);
      
      setProductos(productosData.data);
      setCategorias(categoriasData.data);
      setProveedores(proveedoresData.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar datos', error);
      setLoading(false);
    }
  };

  const aplicarFiltros = () => {
    let filtrados = [...productos];

    if (filtros.busqueda) {
      const busqueda = filtros.busqueda.toLowerCase();
      filtrados = filtrados.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) ||
        p.codigo?.toLowerCase().includes(busqueda)
      );
    }

    if (filtros.categoria) {
      filtrados = filtrados.filter(p => p.categoria_id == filtros.categoria);
    }

    if (filtros.proveedor) {
      filtrados = filtrados.filter(p => p.proveedor_id == filtros.proveedor);
    }

    setProductosFiltrados(filtrados);
  };

  const handleFiltroChange = (campo, valor) => {
    setFiltros({
      ...filtros,
      [campo]: valor
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      categoria: '',
      proveedor: ''
    });
  };

  const handleCreate = () => {
    setSelectedProducto(null);
    setShowModal(true);
  };

  const handleEdit = (producto) => {
    setSelectedProducto(producto);
    setShowModal(true);
  };

  const handleStock = (producto) => {
    setSelectedProducto(producto);
    setShowStockModal(true);
  };

  const handleSaveProducto = async (data) => {
    try {
      console.log('Guardando producto:', data);
      if (selectedProducto) {
        console.log('Actualizando producto ID:', selectedProducto.id_producto);
        const result = await productosService.update(selectedProducto.id_producto, data);
        console.log('Producto actualizado:', result);
        alert('Producto actualizado exitosamente');
      } else {
        console.log('Creando nuevo producto');
        const result = await productosService.create(data);
        console.log('Producto creado:', result);
        alert('Producto creado exitosamente');
      }
      setShowModal(false);
      await loadData();
    } catch (error) {
      console.error('Error al guardar producto', error);
      alert('Error al guardar producto: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSaveStock = async (data) => {
    try {
      console.log('Guardando movimiento:', data);
      const result = await movimientosService.create(data);
      console.log('Movimiento guardado:', result);
      setShowStockModal(false);
      await loadData();
      alert('Movimiento registrado exitosamente');
    } catch (error) {
      console.error('Error al guardar movimiento', error);
      alert('Error al guardar movimiento: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        await productosService.delete(id);
        loadData();
      } catch (error) {
        console.error('Error al eliminar producto', error);
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
            <h1>Productos</h1>
            <button onClick={handleCreate} className="btn-primary">
              + Nuevo Producto
            </button>
          </div>

          <div className="filtros-container">
            <div className="search-field">
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                value={filtros.busqueda}
                onChange={(e) => handleFiltroChange('busqueda', e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filtros-group">
              <select
                value={filtros.categoria}
                onChange={(e) => handleFiltroChange('categoria', e.target.value)}
                className="filtro-select"
              >
                <option value="">Todas las categorías</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>

              <select
                value={filtros.proveedor}
                onChange={(e) => handleFiltroChange('proveedor', e.target.value)}
                className="filtro-select"
              >
                <option value="">Todos los proveedores</option>
                {proveedores.map(prov => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre}
                  </option>
                ))}
              </select>

              {(filtros.busqueda || filtros.categoria || filtros.proveedor) && (
                <button onClick={limpiarFiltros} className="btn-clear">
                  Limpiar Filtros
                </button>
              )}
            </div>

            <div className="resultados-count">
              Mostrando {productosFiltrados.length} de {productos.length} productos
            </div>
          </div>
          
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <div className="table-container">
              <table className="product-table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                        No se encontraron productos con los filtros seleccionados
                      </td>
                    </tr>
                  ) : (
                    productosFiltrados.map(producto => (
                    <tr key={producto.id_producto}>
                      <td>{producto.codigo}</td>
                      <td>{producto.nombre}</td>
                      <td>{producto.nombre_categoria}</td>
                      <td>${parseFloat(producto.precio_unitario).toFixed(2)}</td>
                      <td>{producto.cantidad_actual}</td>
                      <td>
                        {parseInt(producto.cantidad_actual) <= parseInt(producto.stock_minimo) ? (
                          <span className="badge warning">Bajo Stock</span>
                        ) : (
                          <span className="badge success">Normal</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button onClick={() => handleStock(producto)} className="btn-sm btn-stock">
                            📦
                          </button>
                          <button onClick={() => handleEdit(producto)} className="btn-sm btn-edit">
                            ✏️
                          </button>
                          <button onClick={() => handleDelete(producto.id_producto)} className="btn-sm btn-delete">
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
            <ProductoModal
              producto={selectedProducto}
              categorias={categorias}
              proveedores={proveedores}
              onClose={() => setShowModal(false)}
              onSave={handleSaveProducto}
            />
          )}

          {showStockModal && selectedProducto && (
            <StockModal
              producto={selectedProducto}
              onClose={() => setShowStockModal(false)}
              onSave={handleSaveStock}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Productos;

