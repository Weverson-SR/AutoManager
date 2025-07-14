import React, { useState } from 'react';
import { driversApi, vehiclesApi, validateVehiclePlate } from '../services/Api';

const Update = () => {
  const [updateType, setUpdateType] = useState('driver'); // 'driver' ou 'vehicle'
  const [itemId, setItemId] = useState('');
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [currentData, setCurrentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Buscar dados atuais
  const fetchCurrentData = async () => {
    if (!itemId || isNaN(itemId) || itemId <= 0) {
      setError('Por favor, insira um ID válido (número positivo).');
      return;
    }

    setLoading(true);
    setError(null);
    setCurrentData(null);

    try {
      let data;
      if (updateType === 'driver') {
        data = await driversApi.getById(itemId);
        setDriverName(data.name || data.nome || '');
      } else {
        data = await vehiclesApi.getById(itemId);
        setVehiclePlate(data.plate || data.placa || '');
      }
      setCurrentData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar motorista
  const handleUpdateDriver = async (e) => {
    e.preventDefault();
    
    if (!driverName.trim()) {
      setError('Nome do motorista é obrigatório');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await driversApi.update(itemId, { nome: driverName.trim() });
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar veículo
  const handleUpdateVehicle = async (e) => {
    e.preventDefault();
    
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
    setSuccess(false);

    try {
      await vehiclesApi.update(itemId, { placa: plateFormatted });
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Limpar formulário
  const clearForm = () => {
    setItemId('');
    setDriverName('');
    setVehiclePlate('');
    setCurrentData(null);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="update-page">
      <h1>Atualizar Dados</h1>
      
      {/* Seletor de tipo */}
      <div className="form-section">
        <div className="form-group">
          <label>Tipo de Atualização</label>
          <select 
            value={updateType} 
            onChange={(e) => {
              setUpdateType(e.target.value);
              clearForm();
            }}
          >
            <option value="driver">Motorista</option>
            <option value="vehicle">Veículo</option>
          </select>
        </div>
      </div>

      {/* Buscar dados atuais */}
      <div className="form-section">
        <h3>1. Buscar {updateType === 'driver' ? 'Motorista' : 'Veículo'}</h3>
        <div className="search-group">
          <div className="form-group">
            <label htmlFor="itemId">ID do {updateType === 'driver' ? 'Motorista' : 'Veículo'}</label>
            <input
              type="number"
              id="itemId"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              placeholder="Digite o ID"
              min="1"
            />
          </div>
          <button 
            className="btn" 
            onClick={fetchCurrentData}
            disabled={!itemId || loading}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </div>

      {/* Formulário de atualização */}
      {currentData && (
        <div className="form-section">
          <h3>2. Dados Atuais</h3>
          <div className="current-data">
            <p><strong>ID:</strong> {currentData.id}</p>
            {updateType === 'driver' ? (
              <p><strong>Nome Atual:</strong> {currentData.name || currentData.nome}</p>
            ) : (
              <p><strong>Placa Atual:</strong> {currentData.plate || currentData.placa}</p>
            )}
          </div>

          <h3>3. Atualizar Dados</h3>
          <form onSubmit={updateType === 'driver' ? handleUpdateDriver : handleUpdateVehicle}>
            {updateType === 'driver' ? (
              <div className="form-group">
                <label htmlFor="driverName">Novo Nome do Motorista *</label>
                <input
                  type="text"
                  id="driverName"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  placeholder="Digite o novo nome"
                  required
                  maxLength={100}
                />
              </div>
            ) : (
              <div className="form-group">
                <label htmlFor="vehiclePlate">Nova Placa do Veículo *</label>
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
            )}
            
            <div className="form-buttons">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Atualizando...' : 'Atualizar'}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={clearForm}
                disabled={loading}
              >
                Limpar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Exibição de Erros */}
      {error && (
        <div className="error-message">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Mensagem de Sucesso */}
      {success && (
        <div className="success-message">
          <strong>Sucesso:</strong> Dados atualizados com sucesso!
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

export default Update;
