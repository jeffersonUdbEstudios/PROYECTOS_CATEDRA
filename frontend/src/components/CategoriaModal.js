import React, { useState, useEffect } from 'react';
import './CategoriaModal.css';

const CategoriaModal = ({ categoria, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nombre_categoria: '',
    descripcion: ''
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre_categoria: categoria.nombre_categoria || '',
        descripcion: categoria.descripcion || ''
      });
    }
  }, [categoria]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-sm" onClick={(e) => e.stopPropagation()}>
        <h2>{categoria ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre de Categoría *</label>
            <input
              type="text"
              value={formData.nombre_categoria}
              onChange={(e) => setFormData({ ...formData, nombre_categoria: e.target.value })}
              required
              placeholder="Ej: Herramientas Manuales"
            />
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              rows="3"
              placeholder="Descripción de la categoría..."
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {categoria ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaModal;

