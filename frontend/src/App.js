import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Productos from './pages/Productos';
import Categorias from './pages/Categorias';
import Proveedores from './pages/Proveedores';
import Movimientos from './pages/Movimientos';
import './App.css';

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const ProtectedRoute = ({ children, adminOnly = false }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    if (adminOnly && user.rol !== 'admin') {
      return <Navigate to="/dashboard" />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login onLogin={handleLogin} /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/productos" element={<ProtectedRoute><Productos user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/categorias" element={<ProtectedRoute adminOnly={true}><Categorias user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/proveedores" element={<ProtectedRoute adminOnly={true}><Proveedores user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/movimientos" element={<ProtectedRoute><Movimientos user={user} onLogout={handleLogout} /></ProtectedRoute>} />
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

export default App;

