import React from 'react';
import './Sidebar.css';

const Sidebar = ({ currentPage, setCurrentPage, loading }) => {
  const menuItems = [
    { id: 'home', label: 'Início'},
    { id: 'create', label: 'Cadastrar'},
    { id: 'update', label: 'Atualizar'},
    { id: 'delete', label: 'Deletar'},
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sistema</h2>
        <p>Motoristas & Veículos</p>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`sidebar-item ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
            disabled={loading}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <p>v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;
