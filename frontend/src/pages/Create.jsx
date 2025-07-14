import React, { useState } from 'react';
import { driversApi, vehiclesApi, validateVehiclePlate } from '../services/Api';

const Create = () => {
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    setSuccess(false);

    try {
      // 1. Cadastrar motorista
      const motorista = await driversApi.create({ nome: driverName.trim() });

      // 2. Cadastrar veículo vinculado ao motorista
      await vehiclesApi.create({ 
        placa: plateFormatted, 
        motorista_id: motorista.id 
      });

      // Limpar formulário após sucesso
      setDriverName('');
      setVehiclePlate('');
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro no cadastro:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-page">
      <h1>Cadastro de Motorista e Veículo</h1>
      
      {/* Seção de Cadastro */}
      <div className="form-section">
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

      {/* Exibição de Erros */}
      {error && (
        <div className="error-message">
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Mensagem de Sucesso */}
      {success && (
        <div className="success-message">
          <strong>Sucesso:</strong> Cadastro realizado com sucesso!
        </div>
      )}

      {/* Indicador de Loading */}
      {loading && (
        <div className="loading-indicator">
          <div className="spinner"></div>
          <p>Processando cadastro...</p>
        </div>
      )}
    </div>
  );
};

export default Create;
