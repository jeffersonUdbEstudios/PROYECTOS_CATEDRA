import React, { useState } from 'react';
import { authService } from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ correo: '', contrasena: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      console.log('Intentando login con:', formData);
      const result = await authService.login(formData);
      console.log('Respuesta del servidor:', result);
      if (result.success) {
        onLogin(result.data.usuario, 'fake-token');
      } else {
        setError(result.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión. Verifica que el backend esté corriendo.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>🔧 Gestor de Inventario</h1>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="login-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="admin@ferreteria.com"
              autoComplete="username"
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              value={formData.contrasena}
              onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
              placeholder="admin123"
              autoComplete="current-password"
            />
          </div>
          
          <button type="button" onClick={handleLogin} className="btn-login" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </div>
        
        <div className="login-footer">
          <p>Credenciales de prueba:</p>
          <p className="credentials">
            <strong>Admin:</strong> admin@ferreteria.com / admin123
          </p>
          <p className="credentials">
            <strong>Empleado:</strong> empleado@ferreteria.com / empleado123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

