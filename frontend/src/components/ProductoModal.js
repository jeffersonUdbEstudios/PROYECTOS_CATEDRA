import React, { useEffect, useState } from 'react';
import './ProductoModal.css';

const ProductoModal = ({ producto, categorias, proveedores, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    categoria_id: '',
    proveedor_id: '',
    precio_unitario: '',
    cantidad_actual: '',
    stock_minimo: '',
    descripcion: '',
    unidad_medida: 'unidad'
  });

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        codigo: producto.codigo || '',
        categoria_id: producto.categoria_id || '',
        proveedor_id: producto.proveedor_id || '',
        precio_unitario: producto.precio_unitario || '',
        cantidad_actual: producto.cantidad_actual || '',
        stock_minimo: producto.stock_minimo || '',
        descripcion: producto.descripcion || '',
        unidad_medida: producto.unidad_medida || 'unidad'
      });
    }
  }, [producto]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Enviando datos del formulario:', formData);
    console.log('Es edición:', !!producto);
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{producto ? 'Editar Producto' : 'Nuevo Producto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Código</label>
              <input
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoría *</label>
              <select
                value={formData.categoria_id}
                onChange={(e) => setFormData({ ...formData, categoria_id: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                {categorias.map(cat => (
                  <option key={cat.id_categoria} value={cat.id_categoria}>
                    {cat.nombre_categoria}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Proveedor *</label>
              <select
                value={formData.proveedor_id}
                onChange={(e) => setFormData({ ...formData, proveedor_id: e.target.value })}
                required
              >
                <option value="">Seleccione...</option>
                {proveedores.map(prov => (
                  <option key={prov.id_proveedor} value={prov.id_proveedor}>
                    {prov.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio Unitario *</label>
              <input
                type="number"
                step="0.01"
                value={formData.precio_unitario}
                onChange={(e) => setFormData({ ...formData, precio_unitario: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Stock Mínimo *</label>
              <input
                type="number"
                value={formData.stock_minimo}
                onChange={(e) => setFormData({ ...formData, stock_minimo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Cantidad Actual</label>
              <input
                type="number"
                value={formData.cantidad_actual}
                onChange={(e) => setFormData({ ...formData, cantidad_actual: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Unidad de Medida</label>
              <input
                type="text"
                value={formData.unidad_medida}
                onChange={(e) => setFormData({ ...formData, unidad_medida: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {producto ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoModal;

