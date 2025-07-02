from .database import Base
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

# Tabela que representa os Motoristas
class Motorista(Base):
    __tablename__ = 'motoristas'

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)

    # Parte responsavel por relacionar o motorista com os veículos
    veiculos = relationship("Veiculo", back_populates="motorista")

# Tabela que representa os Veículos
class Veiculo(Base):
    __tablename__ = 'veiculos'

    id = Column(Integer, primary_key=True, index=True)
    placa = Column(String, unique=True, index=True)

    # Parte responsavel por relacionar o veículo com o motorista
    motorista_id = Column(Integer, ForeignKey('motoristas.id'))
    motorista = relationship("Motorista", back_populates="veiculos")
