import React, {useState} from "react";
import { driversApi, vehiclesApi } from '../services/Api';

const Maintence = () => {

    const [searchDriverId, setSearchDriverId] = useState('');
    const [searchVehicleId, setSearchVehicleId] = useState('');
    const [driverResult, setDriverResult] = useState(null);
    const [vehicleResult, setVehicleResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // Função para limpar resultados anteriores
    const clearResults = () => {
        setDriverResult(null);
        setVehicleResult(null);
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
    
    return (
    <div className="maintence-page">
      <h1>Área de preenchimento de abastecimento e pneus</h1>
      
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
     </div>

        <div className="action-card">
            <h3>Abastecimento</h3>
            <div className="form-group">
                <label htmlFor="">Litros abastecidos</label>
                <input 
                type="number" 
                name="" 
                id="" />
            </div>
        </div>

        <div className="action-card">
            <h3>Pneus</h3>
            <div className="form-group">
                <label htmlFor="">Estado dos pneus</label>
                <input type="text" 
                />
            </div>
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
          <p><strong>Modelo: </strong> {driverResult?.modelo || 'Não informado'}</p>
        </div>
      )}

      {/* Resultado - Veículo */}
      {vehicleResult && (
        <div className="result-card">
          <h4>Resultado - Veículo</h4>
          <p><strong>ID:</strong> {vehicleResult.id}</p>
          <p><strong>Placa:</strong> {vehicleResult.plate || vehicleResult.placa}</p>
          <p><strong>Nome do Motorista:</strong> {vehicleResult.nome || vehicleResult.name || 'Não informado'}</p>
          <p><strong>Modelo: </strong> {vehicleResult.modelo || 'Não informado'}</p>
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

export default Maintence;
