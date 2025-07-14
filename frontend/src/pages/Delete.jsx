import React, { useState } from 'react';
import { driversApi, vehiclesApi } from '../services/Api';

const Delete = () => {
  const [deleteType, setDeleteType] = useState('driver'); // 'driver' ou 'vehicle'
  const [itemId, setItemId] = useState('');
  const [currentData, setCurrentData] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
    setShowConfirmation(false);

    try {
      let data;
      if (deleteType === 'driver') {
        data = await driversApi.getById(itemId);
      } else {
        data = await vehiclesApi.getById(itemId);
      }
      setCurrentData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Confirmar exclusão
  const handleConfirmDelete = () => {
    setShowConfirmation(true);
  };

  // Executar exclusão
  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (deleteType === 'driver') {
        await driversApi.delete(itemId);
      } else {
        await vehiclesApi.delete(itemId);
      }
      
      setSuccess(true);
      setCurrentData(null);
      setShowConfirmation(false);
      setItemId('');
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      setError(error.message);
      setShowConfirmation(false);
    } finally {
      setLoading(false);
    }
  };

  // Cancelar exclusão
  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  // Limpar formulário
  const clearForm = () => {
    setItemId('');
    setCurrentData(null);
    setShowConfirmation(false);
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="delete-page">
      <h1>Deletar Dados</h1>
      
      <div className="warning-message">
        <strong>⚠️ Atenção:</strong> Esta ação não pode ser desfeita. Certifique-se de que deseja realmente deletar os dados.
      </div>

      {/* Seletor de tipo */}
      <div className="form-section">
        <div className="form-group">
          <label>Tipo de Exclusão</label>
          <select 
            value={deleteType} 
            onChange={(e) => {
              setDeleteType(e.target.value);
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
        <h3>1. Buscar {deleteType === 'driver' ? 'Motorista' : 'Veículo'}</h3>
        <div className="search-group">
          <div className="form-group">
            <label htmlFor="itemId">ID do {deleteType === 'driver' ? 'Motorista' : 'Veículo'}</label>
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

      {/* Dados encontrados */}
      {currentData && !showConfirmation && (
        <div className="form-section">
          <h3>2. Dados Encontrados</h3>
          <div className="current-data">
            <p><strong>ID:</strong> {currentData.id}</p>
            {deleteType === 'driver' ? (
              <>
                <p><strong>Nome:</strong> {currentData.name || currentData.nome}</p>
                <p><strong>Placa do Veículo:</strong> {currentData.placa || 'Não informado'}</p>
              </>
            ) : (
              <>
                <p><strong>Placa:</strong> {currentData.plate || currentData.placa}</p>
                <p><strong>Motorista:</strong> {currentData.nome || currentData.name || 'Não informado'}</p>
              </>
            )}
          </div>

          <div className="form-buttons">
            <button 
              className="btn btn-danger"
              onClick={handleConfirmDelete}
              disabled={loading}
            >
              🗑️ Deletar {deleteType === 'driver' ? 'Motorista' : 'Veículo'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={clearForm}
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Confirmação de exclusão */}
      {showConfirmation && (
        <div className="form-section confirmation-section">
          <h3>⚠️ Confirmar Exclusão</h3>
          <div className="confirmation-message">
            <p>Tem certeza que deseja deletar este {deleteType === 'driver' ? 'motorista' : 'veículo'}?</p>
            <div className="confirmation-data">
              <p><strong>ID:</strong> {currentData.id}</p>
              {deleteType === 'driver' ? (
                <p><strong>Nome:</strong> {currentData.name || currentData.nome}</p>
              ) : (
                <p><strong>Placa:</strong> {currentData.plate || currentData.placa}</p>
              )}
            </div>
          </div>

          <div className="form-buttons">
            <button 
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? 'Deletando...' : '✓ Confirmar Exclusão'}
            </button>
            <button 
              className="btn btn-secondary"
              onClick={handleCancelDelete}
              disabled={loading}
            >
              ✗ Cancelar
            </button>
          </div>
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
          <strong>Sucesso:</strong> {deleteType === 'driver' ? 'Motorista' : 'Veículo'} deletado com sucesso!
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

export default Delete;
