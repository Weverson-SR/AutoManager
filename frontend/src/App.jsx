import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Create from './pages/Create';
import Update from './pages/Update';
import Delete from './pages/Delete';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(false);

  // Renderizar página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'create':
        return <Create />;
      case 'update':
        return <Update />;
      case 'delete':
        return <Delete />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="app">
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        loading={loading}
      />
      
      <main className="main-content">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;
