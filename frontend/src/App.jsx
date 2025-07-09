import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const API_BASE_URL = 'http://localhost:8000'; // URL base da API FastAPI

  // Estados para cadastro
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  
  // Estados para busca
  const [searchDriverId, setSearchDriverId] = useState('');
  const [searchVehicleId, setSearchVehicleId] = useState('');
  
  // Estados para resultados
  const [driverResult, setDriverResult] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);
  const [allDrivers, setAllDrivers] = useState([]);
  
  // Estados de controle
  const [showAllDrivers, setShowAllDrivers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para limpar resultados anteriores
  const clearResults = () => {
    setDriverResult(null);
    setVehicleResult(null);
    setShowAllDrivers(false);
    setError(null);
  };

  // Função para validar placa do veículo
  const validateVehiclePlate = (plate) => {
    const plateRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
    return plateRegex.test(plate.toUpperCase());
  };

  // Cadastro de motorista e veículo
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!driverName.trim()) {
      setError('Nome do motorista é obrigatório');
      return;
    }
    
    if (!vehiclePlate.trim()) {
      setError('Placa do veículo é obrigatória');
      return;
    }

    const plateFormatted = vehiclePlate.toUpperCase().replace(/\s+/g, '');
    
    if (!validateVehiclePlate(plateFormatted)) {
      setError('Formato de placa inválido. Use o formato ABC1234 ou ABC1D23');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Cadastrar motorista
      const resMotorista = await fetch(`${API_BASE_URL}/motoristas/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: driverName.trim() }),
      });

      if (!resMotorista.ok) {
        const errorData = await resMotorista.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao cadastrar motorista');
      }

      const motorista = await resMotorista.json();

      // 2. Cadastrar veículo vinculado ao motorista
      const resVeiculo = await fetch(`${API_BASE_URL}/veiculos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          placa: plateFormatted, 
          motorista_id: motorista.id 
        }),
      });

      if (!resVeiculo.ok) {
        const errorData = await resVeiculo.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao cadastrar veículo');
      }

      // Limpar formulário após sucesso
      setDriverName('');
      setVehiclePlate('');
      clearResults();
      
      alert('Cadastro realizado com sucesso!');
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar motorista por ID
  const searchByDriverId = async () => {
    if (!searchDriverId || isNaN(searchDriverId) || searchDriverId <= 0) {
      setError('Por favor, insira um ID de motorista válido (número positivo).');
      return;
    }

    setLoading(true);
    setError(null);
    clearResults();

    try {
      const response = await fetch(`${API_BASE_URL}/motoristas/${searchDriverId}`);
      
      if (response.ok) {
        const data = await response.json();
        setDriverResult(data);
        console.log('Driver Result:', data);
      } else if (response.status === 404) {
        setError('Motorista não encontrado.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao buscar motorista');
      }
    } catch (error) {
      console.error('Erro ao buscar motorista:', error);
      setError(error.message || 'Erro ao buscar motorista. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar veículo por ID
  const searchByVehicleId = async () => {
    if (!searchVehicleId || isNaN(searchVehicleId) || searchVehicleId <= 0) {
      setError('Por favor, insira um ID de veículo válido (número positivo).');
      return;
    }

    setLoading(true);
    setError(null);
    clearResults();

    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/${searchVehicleId}`);
      
      if (response.ok) {
        const data = await response.json();
        setVehicleResult(data);
      } else if (response.status === 404) {
        setError('Veículo não encontrado.');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao buscar veículo');
      }
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      setError(error.message || 'Erro ao buscar veículo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Buscar todos os motoristas
  const showAll = async () => {
    setLoading(true);
    setError(null);
    clearResults();

    try {
      const response = await fetch(`${API_BASE_URL}/motoristas/`);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Erro ao buscar os dados');
      }

      const data = await response.json();
      setAllDrivers(data);
      console.log('All Drivers:', data);
      setShowAllDrivers(true);
      
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      setError(error.message || 'Erro ao buscar motoristas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar campos de busca
  const clearSearch = () => {
    setSearchDriverId('');
    setSearchVehicleId('');
    clearResults();
  };

  return (
    <div className="container">
      <h1>Sistema de Cadastro de Motoristas e Veículos</h1>
      
      {/* Seção de Cadastro */}
      <div className="form-section">
        <h2>Cadastro de Motorista e Veículo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driverName">Nome do Motorista *</label>
              <input
                type="text"
                id="driverName"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Digite o nome completo do motorista"
                required
                maxLength={100}
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehiclePlate">Placa do Veículo *</label>
              <input
                type="text"
                id="vehiclePlate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="ABC1234 ou ABC1D23"
                required
                maxLength={8}
              />
              <small>Formato: ABC1234 (antigo) ou ABC1D23 (Mercosul)</small>
            </div>
          </div>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>

      {/* Seção de Ações */}
      <div className="actions-section">
        <div className="action-card">
          <h3>Buscar por ID do Motorista</h3>
          <div className="search-group">
            <div className="form-group">
              <label htmlFor="searchDriverId">ID do Motorista</label>
              <input
                type="number"
                id="searchDriverId"
                value={searchDriverId}
                onChange={(e) => setSearchDriverId(e.target.value)}
                placeholder="Digite o ID"
                min="1"
              />
            </div>
            <button 
              className="btn" 
              onClick={searchByDriverId}
              disabled={!searchDriverId || loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>Buscar por ID do Veículo</h3>
          <div className="search-group">
            <div className="form-group">
              <label htmlFor="searchVehicleId">ID do Veículo</label>
              <input
                type="number"
                id="searchVehicleId"
                value={searchVehicleId}
                onChange={(e) => setSearchVehicleId(e.target.value)}
                placeholder="Digite o ID"
                min="1"
              />
            </div>
            <button 
              className="btn" 
              onClick={searchByVehicleId}
              disabled={!searchVehicleId || loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>Mostrar Todos os Registros</h3>
          <button 
            className="btn" 
            onClick={showAll}
            disabled={loading}
          >
            {loading ? 'Carregando...' : 'Mostrar Todos'}
          </button>
        </div>

        {(searchDriverId || searchVehicleId || showAllDrivers) && (
          <div className="action-card">
            <h3>Limpar Busca</h3>
            <button 
              className="btn btn-secondary" 
              onClick={clearSearch}
              disabled={loading}
            >
              Limpar
            </button>
          </div>
        )}
      </div>

      {/* Exibição de Erros */}
      {error && (
        <div className="error-message">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Resultado - Motorista */}
      {driverResult && (
        <div className="result-card">
          <h4>Resultado - Motorista</h4>
          <p><strong>ID:</strong> {driverResult.id}</p>
          <p><strong>Nome:</strong> {driverResult.name || driverResult.nome}</p>
          <p><strong>Placa do Veículo:</strong> {driverResult?.placa || 'Não informado'}</p>
        </div>
      )}

      {/* Resultado - Veículo */}
      {vehicleResult && (
        <div className="result-card">
          <h4>Resultado - Veículo</h4>
          <p><strong>ID:</strong> {vehicleResult.id}</p>
          <p><strong>Placa:</strong> {vehicleResult.plate || vehicleResult.placa}</p>
          <p><strong>Nome do Motorista:</strong> {vehicleResult.nome || vehicleResult.name || 'Não informado'}</p>
        </div>
      )}

      {/* Tabela - Todos os Registros */}
      {showAllDrivers && (
        <div className="table-container">
          <h3>Todos os Registros ({allDrivers.length})</h3>
          {allDrivers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID do Motorista</th>
                  <th>Nome</th>
                  <th>Placa do Veículo</th>
                </tr>
              </thead>
              <tbody>
                {allDrivers.map(driver => (
                  <tr key={driver.id}>
                    <td>{driver.id}</td>
                    <td>{driver.name || driver.nome}</td>
                    <td>{driver.plate || driver?.placa || driver.veiculo?.placa || driver.vehicle?.plate || 'Não informado'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              Nenhum registro encontrado. Cadastre um motorista para começar.
            </div>
          )}
        </div>
      )}

      {/* Indicador de Loading */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Processando...</p>
        </div>
      )}
    </div>
  );
}

export default App;
