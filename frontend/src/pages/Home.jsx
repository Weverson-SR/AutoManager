import React, { useState, useEffect } from 'react';
import { driversApi, vehiclesApi } from '../services/Api';

const Home = () => {
  const [searchDriverId, setSearchDriverId] = useState('');
  const [searchVehicleId, setSearchVehicleId] = useState('');
  const [driverResult, setDriverResult] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);
  const [allDrivers, setAllDrivers] = useState([]);
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
      const data = await driversApi.getById(searchDriverId);
      setDriverResult(data);
    } catch (error) {
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
      const data = await vehiclesApi.getById(searchVehicleId);
      setVehicleResult(data);
    } catch (error) {
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
      const data = await driversApi.getAll();
      setAllDrivers(data);
      setShowAllDrivers(true);
    } catch (error) {
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
    <div className="home-page">
      <h1>Sistema de Cadastro de Motoristas e Veículos</h1>
      
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
};

export default Home;
