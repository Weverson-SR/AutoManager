import React, { useState } from "react";
import { loadData, saveEvent, getMaintenanceHistory } from '../services/indexedDBService';

const Maintenance = () => {

  const [searchDriverId, setSearchDriverId] = useState('');
  const [searchVehicleId, setSearchVehicleId] = useState('');
  const [driverResult, setDriverResult] = useState(null);
  const [vehicleResult, setVehicleResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Esqueleto para manutenção
  const [manutencaoData, setManutencaoData] = useState({ // CORRIGIDO: era manutenaoData
    abastecimento: {
      litros: '',
      tipo: 'Diesel' // CORRIGIDO: era 'Diesel'
    },
    pneus: {
      dianteiro_esquerdo: 'bom',
      dianteiro_direito: 'bom',
      traseiro_esquerdo: 'bom', // CORRIGIDO: era traseiro_esquero
      traseiro_direito: 'bom'
    }
  });

  const [historico, setHistorico] = useState(null)
  const [salvandoManutencao, setSalvandoManutencao] = useState(false) // CORRIGIDO: era setsalvandoManutencao

  // Limpa os resultados anteriores 
  const clearResults = () => {
    setDriverResult(null); // CORRIGIDO: adicionado null
    setVehicleResult(null); // CORRIGIDO: adicionado null
    setHistorico(null);
    setError(null); // CORRIGIDO: adicionado null
  };

  // Busca o motorista - integrado com indexedDB
  const searchByDriverId = async () => {
    if (!searchDriverId || isNaN(searchDriverId) || searchDriverId <= 0) {
      setError('Por favor, insira um ID de motorista válido')
      return;
    }

    setLoading(true);
    setError(null);
    clearResults();

    try {
      // Usando o indexedDB
      const data = await loadData(searchDriverId, 'motorista');
      setDriverResult(data)

      // Carrega o histórico de manutenção (se existir)
      const hist = await getMaintenanceHistory(searchDriverId);
      setHistorico(hist);

    } catch (error) {
      setError(error.message || 'Erro ao buscar motorista. Tente novamente mais tarde'); // CORRIGIDO: era eroror.message
    } finally {
      setLoading(false)
    }
  };

  // Buscar o veiculo - integrado com indexedDB 
  const searchByVehicleId = async () => {
    // CORRIGIDO: era searchByVehicleId na condição
    if (!searchVehicleId || isNaN(searchVehicleId) || searchVehicleId <= 0) {
      setError('Por favor insira um ID de veículo válido')
      return;
    }

    setLoading(true);
    setError(null);
    clearResults();

    try {
      // Usa o indexedDB
      const data = await loadData(searchVehicleId, 'veiculo');
      setVehicleResult(data);

      // Carrega o historico de manutenção se existir
      const hist = await getMaintenanceHistory(searchVehicleId);
      setHistorico(hist)

    } catch (error) {
      setError(error.message || 'Erro ao buscar veículo. Tente novamente mais tarde.')
    } finally {
      setLoading(false);
    }
  };

  // Salva os dados de manutenção
  const salvarManutencao = async () => {
    const currentRecord = driverResult || vehicleResult;

    if (!currentRecord) {
      setError('Busque um motorista ou veículo primeiro antes de salvar a manutenção.');
      return;
    }

    // Validações básicas
    if (!manutencaoData.abastecimento.litros || manutencaoData.abastecimento.litros <= 0) {
      setError('Por favor, informe uma quantidade válida de litros.');
      return;
    }

    setSalvandoManutencao(true);
    setError(null);

    try {
      // SALVA NO INDEXEDDB usando saveEvent
      const registroAtualizado = await saveEvent(currentRecord.id, manutencaoData);

      // Atualiza o resultado atual
      if (driverResult) {
        setDriverResult(registroAtualizado);
      } else {
        setVehicleResult(registroAtualizado);
      }

      // Atualiza histórico
      const novoHistorico = await getMaintenanceHistory(currentRecord.id);
      setHistorico(novoHistorico);

      // Limpa formulário
      setManutencaoData({
        abastecimento: {
          litros: '',
          tipo: 'gasolina'
        },
        pneus: {
          dianteiro_esquerdo: 'bom',
          dianteiro_direito: 'bom',
          traseiro_esquerdo: 'bom',
          traseiro_direito: 'bom'
        }
      });

      alert('Manutenção salva com sucesso!');

    } catch (error) {
      setError('Erro ao salvar manutenção: ' + error.message);
    } finally {
      setSalvandoManutencao(false);
    }
  };

  //Função para atualizar dados de manutenção
  const handleManutencaoChange = (categoria, campo, valor) => {
    setManutencaoData(prev => ({
      ...prev,
      [categoria]: {
        ...prev[categoria],
        [campo]: valor
      }
    }));
  };

  // Função para formartar a data
  const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    const months = [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    return `${day} ${months[parseInt(month) - 1]} ${year}`
  };

  // Função para cores no tipo de combustivel
  const getColorCombustivel = (type) => {
    const colors = {
      'gasolina': '#e74c3c',
      'etanol': '#27ae60',
      'diesel': '#f39c12',
    };
    return colors[type.toLowerCase()] || '#667eea';
  }

  // Cores para os status dos pneus
  const getColorPneu = (status) => {
    const colors = {
      'bom': '',
      'ruim': '',
      'critico': ''
    };
    return colors[status.toLowerCase()] || '#95a5a6'
  }



  return (
    <div className="maintenance-page">
      <h1>Área de preenchimento de abastecimento e pneus</h1>

      {/* Seção de Busca */}
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
              className="btn btn-primary"
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
              className="btn btn-primary"
              onClick={searchByVehicleId}
              disabled={!searchVehicleId || loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </div>
      </div>

      {/* FORMULÁRIO DE MANUTENÇÃO - Só aparece se tiver resultado */}
      {(driverResult || vehicleResult) && (
        <div className="maintenance-form">
          <h2>Registrar Manutenção</h2>

          {/* Abastecimento */}
          <div className="action-card">
            <h3>⛽ Abastecimento</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Tipo de Combustível</label>
                <select
                  value={manutencaoData.abastecimento.tipo}
                  onChange={(e) => handleManutencaoChange('abastecimento', 'tipo', e.target.value)}
                >
                  <option value="gasolina">Gasolina</option>
                  <option value="etanol">Etanol</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
              <div className="form-group">
                <label>Litros abastecidos</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={manutencaoData.abastecimento.litros}
                  onChange={(e) => handleManutencaoChange('abastecimento', 'litros', parseFloat(e.target.value) || '')}
                  placeholder="Ex: 45.5"
                />
              </div>
            </div>
          </div>

          {/* Pneus */}
          <div className="action-card">
            <h3>🛞 Estado dos Pneus</h3>
            <div className="pneus-grid">
              {[
                { key: 'dianteiro_esquerdo', label: 'Dianteiro Esquerdo' },
                { key: 'dianteiro_direito', label: 'Dianteiro Direito' },
                { key: 'traseiro_esquerdo', label: 'Traseiro Esquerdo' },
                { key: 'traseiro_direito', label: 'Traseiro Direito' }
              ].map(pneu => (
                <div key={pneu.key} className="form-group">
                  <label>{pneu.label}</label>
                  <select
                    value={manutencaoData.pneus[pneu.key]}
                    onChange={(e) => handleManutencaoChange('pneus', pneu.key, e.target.value)}
                  >
                    <option value="bom">Bom</option>
                    <option value="ruim">Ruim</option>
                    <option value="critico">Crítico</option>
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Botão Salvar */}
          <div className="save-section">
            <button
              className="btn btn-primary"
              onClick={salvarManutencao}
              disabled={salvandoManutencao}
            >
              {salvandoManutencao ? '⏳ Salvando...' : '💾 Salvar Manutenção'}
            </button>
          </div>
        </div>
      )}

      {/* Exibição de Erros */}
      {error && (
        <div className="error-message">
          <strong>❌ Erro:</strong> {error}
        </div>
      )}

      {/* Resultado - Motorista */}
      {driverResult && (
        <div className="result-card">
          <h4>👤 Resultado - Motorista</h4>
          <p><strong>ID:</strong> {driverResult.id}</p>
          <p><strong>Nome:</strong> {driverResult.nome}</p>
          <p><strong>Placa do Veículo:</strong> {driverResult.placa || 'Não informado'}</p>
          <p><strong>Modelo:</strong> {driverResult.modelo || 'Não informado'}</p>
          <p><strong>Última atualização:</strong> {new Date(driverResult.lastUpdate).toLocaleString()}</p>
        </div>
      )}

      {/* Resultado - Veículo */}
      {vehicleResult && (
        <div className="result-card">
          <h4>🚗 Resultado - Veículo</h4>
          <p><strong>ID:</strong> {vehicleResult.id}</p>
          <p><strong>Placa:</strong> {vehicleResult.placa}</p>
          <p><strong>Nome do Motorista:</strong> {vehicleResult.nome || 'Não informado'}</p>
          <p><strong>Modelo:</strong> {vehicleResult.modelo || 'Não informado'}</p>
          <p><strong>Última atualização:</strong> {new Date(vehicleResult.lastUpdate).toLocaleString()}</p>
        </div>
      )}

      {/* HISTÓRICO DE MANUTENÇÃO - TIMELINE ATUALIZADO */}
      {historico && Object.keys(historico).length > 0 ? (
        <div className="history-section">
          <h3>📋 Histórico de Manutenção</h3>

          <div className="timeline-container">
            {Object.entries(historico)
              .sort(([a], [b]) => new Date(b) - new Date(a)) // Ordena por data decrescente
              .map(([mes, eventos]) => (
                <div key={mes} className="month-history">
                  <div className="month-header">
                    📅 {mes}
                    <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                      ({eventos.length} evento{eventos.length !== 1 ? 's' : ''})
                    </span>
                  </div>

                  {eventos
                    .sort((a, b) => new Date(b.data + ' ' + b.hora) - new Date(a.data + ' ' + a.hora)) // Ordena eventos por data/hora
                    .map((evento, index) => (
                      <div key={index} className="event-card">
                        <div className="event-header">
                          <div className="event-date">
                            🗓️ {formatDate(evento.data)}
                            <span className="event-time">às {evento.hora}</span>
                          </div>
                        </div>

                        <div className="event-details">
                          {/* Informações de Combustível */}
                          <div className="detail-group">
                            <div className="detail-label">
                              ⛽ Abastecimento
                            </div>
                            <div className="detail-value">
                              <strong>{evento.abastecimento.litros}L</strong>
                              <span
                                className="fuel-badge"
                                style={{ backgroundColor: getColorCombustivel(evento.abastecimento.tipo) }}
                              >
                                {evento.abastecimento.tipo}
                              </span>
                            </div>
                          </div>

                          {/* Informações de Pneus */}
                          <div className="detail-group">
                            <div className="detail-label">
                              🛞 Estado dos Pneus
                            </div>
                            <div className="detail-value">
                              <div className="tire-grid">
                                <div className="tire-item">
                                  <div className="tire-position">DE</div>
                                  <div
                                    className="tire-status"
                                    style={{ color: getColorPneu(evento.pneus.dianteiro_esquerdo) }}
                                  >
                                    {evento.pneus.dianteiro_esquerdo}
                                  </div>
                                </div>
                                <div className="tire-item">
                                  <div className="tire-position">DD</div>
                                  <div
                                    className="tire-status"
                                    style={{ color: getColorPneu(evento.pneus.dianteiro_direito) }}
                                  >
                                    {evento.pneus.dianteiro_direito}
                                  </div>
                                </div>
                                <div className="tire-item">
                                  <div className="tire-position">TE</div>
                                  <div
                                    className="tire-status"
                                    style={{ color: getColorPneu(evento.pneus.traseiro_esquerdo) }}
                                  >
                                    {evento.pneus.traseiro_esquerdo}
                                  </div>
                                </div>
                                <div className="tire-item">
                                  <div className="tire-position">TD</div>
                                  <div
                                    className="tire-status"
                                    style={{ color: getColorPneu(evento.pneus.traseiro_direito) }}
                                  >
                                    {evento.pneus.traseiro_direito}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}
          </div>
        </div>
      ) : historico && (
        <div className="history-section">
          <h3>📋 Histórico de Manutenção</h3>
          <div className="empty-history">
            Nenhum histórico de manutenção encontrado
          </div>
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

export default Maintenance;
