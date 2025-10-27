import React from 'react';
import './Navbar.css';

const Navbar = ({ user, onLogout }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>🔧 Gestor de Inventario</h2>
        <span className="navbar-user">{user.nombre}</span>
      </div>
      <div className="navbar-actions">
        <span className="navbar-role">{user.rol === 'admin' ? '👤 Administrador' : '👤 Empleado'}</span>
        <button onClick={onLogout} className="btn-logout">Cerrar Sesión</button>
      </div>
    </nav>
  );
};

export default Navbar;

