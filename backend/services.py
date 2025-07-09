from .models import Motorista, Veiculo
from .schemas import MotoristaCreate, VeiculoCreate
from sqlalchemy.orm import Session


'''Criando funções para manipular os motoristas no banco de dados '''

def create_motorista(db: Session, data: MotoristaCreate):
    '''Cria um novo motorista no banco de dados.'''
    # cria uma instancia do modelo Motorista
    motorista_instance = Motorista(**data.model_dump())
    # adiciona a instancia do motorista ao banco de dados
    db.add(motorista_instance)
    # faz o commit para salvar as alterações
    db.commit()
    # atualiza a instancia do motorista para refletir as alterações
    db.refresh(motorista_instance)
    # retorna a instancia do motorista criada
    return motorista_instance


def get_motoristas(db: Session):
    '''Consulta todos os motoristas no banco de dados.'''
    motoristas = db.query(Motorista).all()
    result = []

    for motorista in motoristas:
         # Busca o veículo associado ao motorista
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista.id).first()

        # Dicionario com os dados do motorista e a placa
        motorista_data = {
            "id": motorista.id,
            "nome": motorista.nome,
            "placa": veiculo.placa if veiculo else None
        }
        result.append(motorista_data)

    return result


def get_motorista(db: Session, motorista_id: int):
    '''Consulta um motorista específico pelo ID.'''
    motorista = db.query(Motorista).filter(Motorista.id == motorista_id).first()

    if motorista:
        # Busca o veículo associado ao motorista
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista.id).first()

        # Dicionario com os dados do motorista e a placa
        motorista_data = {
            "id": motorista.id,
            "nome": motorista.nome,
            "placa": veiculo.placa if veiculo else None
        }
        return motorista_data
    return None


def update_motorista(db: Session, motorista: MotoristaCreate, motorista_id: int):
    '''Atualiza um motorista existente no banco de dados.'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    # verifica se o motorista existe
    if motorista_queryset:
        # Atualiza os campos do motorista com os dados fornecidos
        for key, value in motorista.model_dump().items():
            setattr(motorista_queryset, key, value)
        # faz o commit para salvar as alterações
        db.commit()
        # atualiza a instancia do motorista para refletir as alterações
        db.refresh(motorista_queryset)

        # retorna a instancia do motorista atualizada
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista_queryset.id).first()
        # Retorna os dados formatados com a placa
        return {
            'id': motorista_queryset.id,
            'nome': motorista_queryset.nome,
            'placa': veiculo.placa if veiculo else None
        }

    
def delete_motorista(db: Session, motorista_id: int):
    '''Deleta um motorista do banco de dados'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    # verifica se o motorista existe
    if motorista_queryset:
        # Busca dados para retorno antes de deletar
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista_queryset.id).first()
        motorista_data = {
            "id": motorista_queryset.id,
            "nome": motorista_queryset.nome,
            "placa": veiculo.placa if veiculo else None
        }
        # deleta o motorista do banco de dados
        db.delete(motorista_queryset)
        # faz o commit para salvar as alterações
        db.commit()
        # retorna o motorista deletado
        return motorista_data


'''Criando funções para manipular os veículos no banco de dados'''

def create_veiculo(db: Session, data: VeiculoCreate):
    '''Cria um novo veículo no banco de dados.'''
    veiculo_instance = Veiculo(**data.model_dump())
    db.add(veiculo_instance)
    db.commit()
    db.refresh(veiculo_instance)

    # Busca o nome do motorista para retornor
    motorista = db.query(Motorista).filter(Motorista.id == veiculo_instance.motorista_id).first()

    return {
        "id": veiculo_instance.id,
        "placa": veiculo_instance.placa,
        "nome": motorista.nome if motorista else None
    }

def get_veiculos(db: Session):
    '''Consulta todos os veículos no banco de dados com o nome do motorista.'''
    veiculos = db.query(Veiculo).all()
    result = []
    
    for veiculo in veiculos:
        # Busca o motorista associado ao veículo
        motorista = db.query(Motorista).filter(Motorista.id == veiculo.motorista_id).first()
        
        # Cria um objeto dict com os dados do veículo e o nome do motorista
        veiculo_data = {
            'id': veiculo.id,
            'placa': veiculo.placa,
            'nome': motorista.nome if motorista else None
        }
        result.append(veiculo_data)
    
    return result

def get_veiculo(db: Session, veiculo_id: int):
    '''Consulta um veículo específico pelo ID com o nome do motorista.'''
    veiculo = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    
    if veiculo:
        # Busca o motorista associado ao veículo
        motorista = db.query(Motorista).filter(Motorista.id == veiculo.motorista_id).first()
        
        # Cria um objeto dict com os dados do veículo e o nome do motorista
        veiculo_data = {
            'id': veiculo.id,
            'placa': veiculo.placa,
            'nome': motorista.nome if motorista else None
        }
        return veiculo_data
    
    return None

from .models import Motorista, Veiculo
from .schemas import MotoristaCreate, VeiculoCreate
from sqlalchemy.orm import Session


# Criando funções para manipular os motoristas no banco de dados 
def create_motorista(db: Session, data: MotoristaCreate):
    '''Cria um novo motorista no banco de dados.'''
    # cria uma instancia do modelo Motorista
    motorista_instance = Motorista(**data.model_dump())
    # adiciona a instancia do motorista ao banco de dados
    db.add(motorista_instance)
    # faz o commit para salvar as alterações
    db.commit()
    # atualiza a instancia do motorista para refletir as alterações
    db.refresh(motorista_instance)
    # retorna a instancia do motorista criada
    return motorista_instance


def get_motoristas(db: Session):
    '''Consulta todos os motoristas no banco de dados com suas respectivas placas.'''
    motoristas = db.query(Motorista).all()
    result = []
    
    for motorista in motoristas:
        # Busca o veículo associado ao motorista
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista.id).first()
        
        # Cria um objeto dict com os dados do motorista e a placa
        motorista_data = {
            'id': motorista.id,
            'nome': motorista.nome,
            'placa': veiculo.placa if veiculo else None
        }
        result.append(motorista_data)
    
    return result


def get_motorista(db: Session, motorista_id: int):
    '''Consulta um motorista específico pelo ID com a placa do veículo.'''
    motorista = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    
    if motorista:
        # Busca o veículo associado ao motorista
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista.id).first()
        
        # Cria um objeto dict com os dados do motorista e a placa
        motorista_data = {
            'id': motorista.id,
            'nome': motorista.nome,
            'placa': veiculo.placa if veiculo else None
        }
        return motorista_data
    
    return None


def update_motorista(db: Session, motorista: MotoristaCreate, motorista_id: int):
    '''Atualiza um motorista existente no banco de dados.'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    # verifica se o motorista existe
    if motorista_queryset:
        # Atualiza os campos do motorista com os dados fornecidos
        for key, value in motorista.model_dump().items():
            setattr(motorista_queryset, key, value)
        # faz o commit para salvar as alterações
        db.commit()
        # atualiza a instancia do motorista para refletir as alterações
        db.refresh(motorista_queryset)
        
        # Retorna os dados formatados com a placa
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista_queryset.id).first()
        return {
            'id': motorista_queryset.id,
            'nome': motorista_queryset.nome,
            'placa': veiculo.placa if veiculo else None
        }

    
def delete_motorista(db: Session, motorista_id: int):
    '''Deleta um motorista do banco de dados'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    # verifica se o motorista existe
    if motorista_queryset:
        # Busca dados para retorno antes de deletar
        veiculo = db.query(Veiculo).filter(Veiculo.motorista_id == motorista_queryset.id).first()
        motorista_data = {
            'id': motorista_queryset.id,
            'nome': motorista_queryset.nome,
            'placa': veiculo.placa if veiculo else None
        }
        
        # deleta o motorista do banco de dados
        db.delete(motorista_queryset)
        # faz o commit para salvar as alterações
        db.commit()
        # retorna o motorista deletado
        return motorista_data


# Criando funções para manipular os veículos no banco de dados
def create_veiculo(db: Session, data: VeiculoCreate):
    '''Cria um novo veículo no banco de dados.'''
    veiculo_instance = Veiculo(**data.model_dump())
    db.add(veiculo_instance)
    db.commit()
    db.refresh(veiculo_instance)
    
    # Busca o nome do motorista para retornar
    motorista = db.query(Motorista).filter(Motorista.id == veiculo_instance.motorista_id).first()
    
    return {
        'id': veiculo_instance.id,
        'placa': veiculo_instance.placa,
        'nome': motorista.nome if motorista else None
    }

def get_veiculos(db: Session):
    '''Consulta todos os veículos no banco de dados com o nome do motorista.'''
    veiculos = db.query(Veiculo).all()
    result = []
    
    for veiculo in veiculos:
        # Busca o motorista associado ao veículo
        motorista = db.query(Motorista).filter(Motorista.id == veiculo.motorista_id).first()
        
        # Cria um objeto dict com os dados do veículo e o nome do motorista
        veiculo_data = {
            'id': veiculo.id,
            'placa': veiculo.placa,
            'nome': motorista.nome if motorista else None
        }
        result.append(veiculo_data)
    
    return result

def get_veiculo(db: Session, veiculo_id: int):
    '''Consulta um veículo específico pelo ID com o nome do motorista.'''
    veiculo = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    
    if veiculo:
        # Busca o motorista associado ao veículo
        motorista = db.query(Motorista).filter(Motorista.id == veiculo.motorista_id).first()
        
        # Cria um objeto dict com os dados do veículo e o nome do motorista
        veiculo_data = {
            'id': veiculo.id,
            'placa': veiculo.placa,
            'nome': motorista.nome if motorista else None
        }
        return veiculo_data
    
    return None

def update_veiculo(db: Session, veiculo: VeiculoCreate, veiculo_id: int):
    '''Atualiza um veículo existente no banco de dados.'''
    veiculo_queryset = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    if veiculo_queryset:
        for key, value in veiculo.model_dump().items():
            setattr(veiculo_queryset, key, value)
        db.commit()
        db.refresh(veiculo_queryset)
        
        # Busca o nome do motorista para retornar
        motorista = db.query(Motorista).filter(Motorista.id == veiculo_queryset.motorista_id).first()
        
        return {
            'id': veiculo_queryset.id,
            'placa': veiculo_queryset.placa,
            'nome': motorista.nome if motorista else None
        }

def delete_veiculo(db: Session, veiculo_id: int):
    '''Deleta um veículo do banco de dados.'''
    veiculo_queryset = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    if veiculo_queryset:
        # Busca dados para retorno antes de deletar
        motorista = db.query(Motorista).filter(Motorista.id == veiculo_queryset.motorista_id).first()
        veiculo_data = {
            'id': veiculo_queryset.id,
            'placa': veiculo_queryset.placa,
            'nome': motorista.nome if motorista else None
        }
        
        db.delete(veiculo_queryset)
        db.commit()
        return veiculo_data
