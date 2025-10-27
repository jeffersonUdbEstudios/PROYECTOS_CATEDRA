import React, { useState } from 'react';
import './StockModal.css';

const StockModal = ({ producto, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    cantidad: '',
    motivo: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.cantidad || parseInt(formData.cantidad) <= 0) {
      alert('La cantidad debe ser mayor a 0');
      return;
    }

    if (formData.tipo === 'salida' && producto.cantidad_actual < parseInt(formData.cantidad)) {
      alert('Stock insuficiente para esta salida');
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !user.id_usuario) {
      alert('Error: Usuario no encontrado');
      return;
    }

    console.log('Enviando datos de movimiento:', {
      producto_id: producto.id_producto,
      tipo: formData.tipo,
      cantidad: parseInt(formData.cantidad),
      motivo: formData.motivo,
      usuario_id: user.id_usuario
    });

    onSave({
      producto_id: producto.id_producto,
      tipo: formData.tipo,
      cantidad: parseInt(formData.cantidad),
      motivo: formData.motivo || null,
      precio_unitario: null,
      observaciones: null,
      usuario_id: user.id_usuario
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Gestión de Stock</h2>
        <div className="producto-info">
          <strong>Producto:</strong> {producto.nombre}
          <br />
          <strong>Stock Actual:</strong> {producto.cantidad_actual}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipo de Movimiento *</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
              required
            >
              <option value="entrada">Entrada</option>
              <option value="salida">Salida</option>
            </select>
          </div>

          <div className="form-group">
            <label>Cantidad *</label>
            <input
              type="number"
              min="1"
              value={formData.cantidad}
              onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Motivo</label>
            <input
              type="text"
              value={formData.motivo}
              onChange={(e) => setFormData({ ...formData, motivo: e.target.value })}
              placeholder="Ej: Compra, Venta, Ajuste..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              Guardar Movimiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StockModal;

