const API_BASE_URL = 'http://localhost:8000';

// Função para validar placa do veículo
export const validateVehiclePlate = (plate) => {
  const plateRegex = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
  return plateRegex.test(plate.toUpperCase());
};

// Serviços de API para Motoristas
export const driversApi = {
  // Cadastrar motorista
  create: async (driverData) => {
    const response = await fetch(`${API_BASE_URL}/motoristas/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao cadastrar motorista');
    }
    
    return await response.json();
  },

  // Buscar motorista por ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/motoristas/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Motorista não encontrado.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao buscar motorista');
    }
    
    return await response.json();
  },

  // Buscar todos os motoristas
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/motoristas/`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao buscar os dados');
    }
    
    return await response.json();
  },

  // Atualizar motorista
  update: async (id, driverData) => {
    const response = await fetch(`${API_BASE_URL}/motoristas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(driverData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao atualizar motorista');
    }
    
    return await response.json();
  },

  // Deletar motorista
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/motoristas/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao deletar motorista');
    }
    
    return response.status === 204;
  }
};

// Serviços de API para Veículos
export const vehiclesApi = {
  // Cadastrar veículo
  create: async (vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/veiculos/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao cadastrar veículo');
    }
    
    return await response.json();
  },

  // Buscar veículo por ID
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/veiculos/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Veículo não encontrado.');
      }
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao buscar veículo');
    }
    
    return await response.json();
  },

  // Buscar todos os veículos
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/veiculos/`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao buscar veículos');
    }
    
    return await response.json();
  },

  // Atualizar veículo
  update: async (id, vehicleData) => {
    const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicleData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao atualizar veículo');
    }
    
    return await response.json();
  },

  // Deletar veículo
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/veiculos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || 'Erro ao deletar veículo');
    }
    
    return response.status === 204;
  }
};
