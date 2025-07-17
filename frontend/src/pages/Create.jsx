import React, { useState } from 'react';
import { driversApi, vehiclesApi, validateVehiclePlate } from '../services/Api';

const Create = () => {
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [vehicleModel, setvehicleModel] = useState(''); // adiconado para receber o modelo
  const [cadastroData, setCadastroData] = useState(''); // adicionado para receber a data 
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

    if (!vehicleModel.trim()){
      setError('Modelo do veiculo é obrigatorio')
      return;
    }

    if (!cadastroData.trim()){
      setError('Data do cadastro é obrigatória')
      return
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
        motorista_id: motorista.id,
        modelo: vehicleModel.trim(),
        data_cadastro: cadastroData
      });

      // Limpar formulário após sucesso
      setDriverName('');
      setVehiclePlate('');
      setvehicleModel('');
      setCadastroData('');
      setSuccess(true);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Erro no cadastro', error);
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
            {/*Cadastro do nome do motorista*/}
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
            {/*Cadastro da placa do veiculo*/}
            <div className="form-group">
              <label htmlFor="vehiclePlate">Placa do Veículo *</label>
              <input
                type="text"
                id="vehiclePlate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value.toUpperCase())}
                placeholder="ABC1234 ou ABC1D23"
                required
                maxLength={7}
              />
              <small>Formato: ABC1234 (antigo) ou ABC1D23 (Mercosul)</small>
            </div>
            {/*Adicionando a parte para receber o modelo do veiculo no cadastro*/}
            <div className='form-group'>
              <label htmlFor="vehicleModel">Modelo do veiculo *</label>
              <input 
                type="text"
                id="vehicleModel"
                value={vehicleModel}
                onChange={(e) => setvehicleModel(e.target.value)}
                placeholder='Ex: Volvo'
                required
                maxLength={30}
              />
            </div>
            {/*Adicionando a parte para receber a data criação do cadastro*/}
            <div className='form-group'>
              <label htmlFor="cadastroData">Data do cadastro *</label>
              <input 
                min={2000}
                type="date"
                id="cadastroData"
                value={cadastroData}
                onChange={(e) => setCadastroData(e.target.value)}
                required
              />
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
