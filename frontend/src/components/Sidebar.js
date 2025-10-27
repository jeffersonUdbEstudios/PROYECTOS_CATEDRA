import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const allMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/productos', label: 'Productos', icon: '📦' },
    { path: '/categorias', label: 'Categorías', icon: '🏷️', adminOnly: true },
    { path: '/proveedores', label: 'Proveedores', icon: '🏢', adminOnly: true },
    { path: '/movimientos', label: 'Movimientos', icon: '🔄' }
  ];

  const menuItems = user?.rol === 'admin' 
    ? allMenuItems 
    : allMenuItems.filter(item => !item.adminOnly);

  return (
    <aside className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="menu-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;

