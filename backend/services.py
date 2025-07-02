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
    '''Consulta todos os motoristas no banco de dados.'''
    return db.query(Motorista).all()


def get_motorista(db: Session, motorista_id: int):
    '''Consulta um motorista específico pelo ID.'''
    return db.query(Motorista).filter(Motorista.id == motorista_id).first()


def update_motorista(db: Session, motorista: MotoristaCreate, motorista_id: int):
    '''Atualiza um motorista existente no banco de dados.'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id)
    # verifica se o motorista existe
    if motorista_queryset:
        # Atualiza os campos do motorista com os dados fornecidos
        for key, value in motorista.model_dump().items():
            setattr(motorista_queryset.first(), key, value)
        # faz o commit para salvar as alterações
        db.commit()
        # atualiza a instancia do motorista para refletir as alterações
        db.refresh(motorista_queryset)
        # retorna a instancia do motorista atualizada
        return motorista_queryset.first()

    
def delete_motorista(db: Session, motorista_id: int):
    '''Deleta um motorista do banco de dados'''
    # busca o motorista pelo ID
    motorista_queryset = db.query(Motorista).filter(Motorista.id == motorista_id).first()
    # verifica se o motorista existe
    if motorista_queryset:
        # deleta o motorista do banco de dados
        db.delete(motorista_queryset)
        # faz o commit para salvar as alterações
        db.commit()
        # retorna o motorista deletado
        return motorista_queryset


# Criando funções para manipular os veículos no banco de dados
def create_veiculo(db: Session, data: VeiculoCreate):
    '''Cria um novo veículo no banco de dados.'''
    veiculo_instance = Veiculo(**data.model_dump())
    db.add(veiculo_instance)
    db.commit()
    db.refresh(veiculo_instance)
    return veiculo_instance

def get_veiculos(db: Session):
    '''Consulta todos os veículos no banco de dados.'''
    return db.query(Veiculo).all()

def get_veiculo(db: Session, veiculo_id: int):
    '''Consulta um veículo específico pelo ID.'''
    return db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()

def update_veiculo(db: Session, veiculo: VeiculoCreate, veiculo_id: int):
    '''Atualiza um veículo existente no banco de dados.'''
    veiculo_queryset = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    if veiculo_queryset:
        for key, value in veiculo.model_dump().items():
            setattr(veiculo_queryset, key, value)
        db.commit()
        db.refresh(veiculo_queryset)
        return veiculo_queryset

def delete_veiculo(db: Session, veiculo_id: int):
    '''Deleta um veículo do banco de dados.'''
    veiculo_queryset = db.query(Veiculo).filter(Veiculo.id == veiculo_id).first()
    if veiculo_queryset:
        db.delete(veiculo_queryset)
        db.commit()
        return veiculo_queryset
