import React, { useState , useEffect} from 'react';
import './App.css';

function App() {
  const API_BASE_URL = 'http://localhost:8000'; // URL base da API FastAPI

  const [drivers, setDrivers] = useState([]);
  const [driverName, setDriverName] = useState('');
  const [vehiclePlate, setVehiclePlate] = useState('');
  const [searchDriverId, setSearchDriverId] = useState('');
  const [searchVehicleId, setSearchVehicleId] = useState('');
  const [driverResult, setDriverResult] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);
  const [showAllDrivers, setShowAllDrivers] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (driverName && vehiclePlate) {
      setLoading(true);
      try {
        // 1. Cadastrar motorista
        const resMotorista = await fetch(`${API_BASE_URL}/motoristas/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome: driverName }),
        });
        if (!resMotorista.ok) throw new Error('Erro ao cadastrar motorista');
        const motorista = await resMotorista.json();

        // 2. Cadastrar veículo vinculado ao motorista
        const resVeiculo = await fetch(`${API_BASE_URL}/veiculos/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ placa: vehiclePlate.toUpperCase(), motorista_id: motorista.id }),
        });
        if (!resVeiculo.ok) throw new Error('Erro ao cadastrar veículo');

        alert('Cadastro realizado com sucesso!');
        setDriverName('');
        setVehiclePlate('');
      } catch (error) {
        alert(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const searchByDriverId = async () => {
    if (!searchDriverId) {
      alert('Por favor, insira um ID de motorista válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/motoristas/${searchDriverId}`);
      if (response.ok) {
        const data = await response.json();
        setDriverResult(data);
      } else if (response.status === 404) {
        setDriverResult(null);
        alert('Motorista não encontrado.');
      } else {
        throw new Error('Erro ao buscar motorista');
      }
      setVehicleResult(null);
      setShowAllDrivers(false);
    } catch (error) {
      console.error('Erro ao buscar motorista:', error);
      alert('Erro ao buscar motorista. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const searchByVehicleId = async () => {
    if (!searchVehicleId) {
      alert('Por favor, insira um ID de veículo válido.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/veiculos/${searchVehicleId}`);
      if (response.ok) {
        const data = await response.json();
        setVehicleResult(data);
      } else if (response.status === 404) {
        setVehicleResult(null);
        alert('Veículo não encontrado.');
      } else {
        throw new Error('Erro ao buscar veículo');
      }
      setDriverResult(null);
      setShowAllDrivers(false);
    } catch (error) {
      console.error('Erro ao buscar veículo:', error);
      alert('Erro ao buscar veículo. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const showAll = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/motoristas/`);

      if (!response.ok) {
        throw new Error('Erro ao buscar os dados');
      }

      const data = await response.json();
      setDrivers(data);
      setDriverResult(null);
      setVehicleResult(null);
    } catch (error) {
      console.error('Erro ao buscar motoristas:', error);
      alert('Erro ao buscar motoristas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Não carrega automaticamente, só quando usuário clicar em "Mostrar Todos"
  }, []);

  return (
    <div className="container">
      <h1>Sistema de Cadastro</h1>
      
      <div className="form-section">
        <h2>Cadastro de Motorista e Veículo</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="driverName">Nome do Motorista</label>
              <input
                type="text"
                id="driverName"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Digite o nome do motorista"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="vehiclePlate">Placa do Veículo</label>
              <input
                type="text"
                id="vehiclePlate"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="Digite a placa do veículo"
                required
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary">Cadastrar</button>
        </form>
      </div>

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
              />
            </div>
            <button 
              className="btn" 
              onClick={searchByDriverId}
              disabled={!searchDriverId}
            >
              Buscar
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
              />
            </div>
            <button 
              className="btn" 
              onClick={searchByVehicleId}
              disabled={!searchVehicleId}
            >
              Buscar
            </button>
          </div>
        </div>

        <div className="action-card">
          <h3>Mostrar Todos</h3>
          <button className="btn" onClick={showAll}>
            Mostrar Todos os Registros
          </button>
        </div>
      </div>

      {driverResult && (
        <div className="result-card">
          <h4>Resultado - Motorista</h4>
          <p><strong>ID:</strong> {driverResult.id}</p>
          <p><strong>Nome:</strong> {driverResult.name}</p>
          <p><strong>Placa:</strong> {driverResult.plate}</p>
        </div>
      )}

      {vehicleResult && (
        <div className="result-card">
          <h4>Resultado - Veículo</h4>
          <p><strong>ID:</strong> {vehicleResult.id}</p>
          <p><strong>Placa:</strong> {vehicleResult.plate}</p>
          <p><strong>Nome do Motorista:</strong> {vehicleResult.name}</p>
        </div>
      )}

      {showAllDrivers && (
        <div className="table-container">
          <h3>Todos os Registros</h3>
          {drivers.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>ID do Motorista</th>
                  <th>Nome</th>
                  <th>Placa do Veículo</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map(driver => (
                  <tr key={driver.id}>
                    <td>{driver.id}</td>
                    <td>{driver.name}</td>
                    <td>{driver.plate}</td>
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
    </div>
  );
}

export default App;
