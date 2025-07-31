// Criação do IndexedDB para gerenciar novos dados a partir do frontend

// classe criada para gerenciar o IndexedDB
class IndexedDBService {
    constructor() {
        this.dbName = 'MaintenanceDB';
        this.dbVersion = 1;
        this.db = null;
    }

    // Fazendo a conexão com o IndexedDB
    async openDB() {
        return new Promise ((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Criar manutenções se não existir
                if (!db.objectStoreNames.contains('maintenances')) {
                    const store = db.createObjectStore('maintenances', {keyPath: 'id'});
                    console.log('Tabela manutenções criada');
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log(' IndexedDB conectado');
                resolve(this.db);
            };

            request.onerror = (event) => {
                console.error('Erro ao abrir o IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    //Buscar o registro de manutenção por ID
    async getRecord(id){
        if (!this.db) await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['maintenances'], 'readonly');
            const store = transaction.objectStore('maintenances');
            const request = store.get(parseInt(id));

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Erro ao buscar o registro:', request.error);
                reject(target.error);
            };
        });
    }

    // Salvar e Atualizar registro
    async saveRecord(record){
        if (!this.db) await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['maintenances'], 'readwrite');
            const store = transaction.objectStore('maintenances');
            const request = store.put(record);

            request.onsuccess = () => {
                console.log('Registro salvo com sucesso: ', record.id);
                resolve(request.result);
            };

            request.onerror = () => {
                console.error('Erro ao salvar o registro:', request.error);
                reject(request.error);
            };
        });
    }

    // Deletar registro
    async deleteRecord(id){
        if (!this.db) await this.openDB();

        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['maintenances'], 'readwrite');
            const store = transaction.objectStore('maintenances');
            const request = store.delete(parseInt(id));

            request.onsuccess = () => {
                console.log('Registro deletado com sucesso: ', id);
                resolve(true);
            };

            request.onerror = () => {
                console.error('Erro ao deletar o registro:', request.error);
                reject(request.error);
            };
        });
    }
    
}


// Exportando a classe para uso em outros arquivos
export const indexedDBService = new IndexedDBService();

// *******Funções principais*******

// Carregar os dados (FastAPI -> IndexedDB)

export const loadData = async (id, type = 'motorista') => {
    try {
        console.log(`Buscando ${type} ID: ${id}`);

        // Verifica se existe dentro do IndexedDB
        const dataExists = await indexedDBService.getRecord(id);

        if (dataExists){
            console.log('Dados encontrados!');
            return dataExists;
        }

        // Se não existir buscamos na FastAPi
        console.log('Buscando dados');
        let dataFastAPI;

        if (type === 'motorista'){
            // Usa a API existente
            const {driversAPI} = await import('../services/Api');
            // Busca pelo id do motorista
            dataFastAPI = await driversAPI.getById(id);
        }else{
            // Busca por id do veiculo
            const {vehiclesAPI} = await import('../services/Api')
            dataFastAPI = await vehiclesAPI.getById(id);
        }

        // Cria a estrutura no IndexedDB
        const recordComplete = {
            // Dados vindo da FastAPI
            id : dataFastAPI.id,
            nome: dataFastAPI.name || dataFastAPI.nome,
            placa: dataFastAPI.plate || dataFastAPI.placa,
            modelo: dataFastAPI.modelo,
            tipo: type, // motorista ou veiculo verificar depois se bate com o que for chamado

            // Campos da manutenção|mainentence
            recordsByPeriod: {},
            lastUpdate: new Date().toISOString(),
            originalData: dataFastAPI // Backup dos dados da FastAPI
        };

        // Salvando no IndexedDB
        await indexedDBService.saveRecord(recordComplete);

        console.log('Dados salvos');
        return recordComplete;
    } catch (error){
        console.error('Erro ao carregar dados: ', error)
        throw error;
    }
};

// Salvar os eventos em manutenção
export const saveEvent = async (id, dataMaintenance) => {
    try{
        console.log('Salvando os dados da manutenção');

        // Busca o registro existente
        const data = await indexedDBService.getRecord(id);
        
        if(!data){
            throw new Error('Registro não encontrado. Carregue os dados primeiro.');
        }
        
        // Calcula o período (mês)
        const dateToday = new Date();
        const month = `${dateToday.getFullYear()}-${String(dateToday.getMonth() + 1).padStart(2, '0')}`;

        // Cria o evento| relação
        const event = {
            id: Date.now(),
            data: dateToday.toISOString().split('T')[0], // estilo americano YYYY-MM-DD
            hora: dateToday.toTimeString().split(' ')[0], // HH:MM:SS
            ...dataMaintenance // Dados dos pneus e do abastecimento
        };

        // Adiciona ao período correto
        if (!data.recordsByPeriod[month]) {
            data.recordsByPeriod[month] = [];
        }

        data.recordsByPeriod[month].push(event);
        data.lastUpdate = new Date().toISOString();

        // Salva o registro atualizado no IndexedDB
        await indexedDBService.saveRecord(data);   
        console.log('Manutenção salva com sucesso');
        return data;

    }catch (error){
        console.error('Erro ao salvar manutenção:', error);
        throw error;
    }
};


// Função para buscar o histórico de manutenção
export const getMaintenanceHistory = async (id, month= null) => {

    try{
        const data = await indexedDBService.getRecord(id);

        if (!data) {
            return null; // Registro não encontrado
        }

        if (month) {
            // Retorna o histórico de um mês específico
            return data.recordsByPeriod[month] || [];
        }

        // Retorna todo o histórico de manutenção
        return data.recordsByPeriod;

    } catch (error) {
        console.error('Erro ao buscar histórico de manutenção:', error);
        throw error;
    }
};


