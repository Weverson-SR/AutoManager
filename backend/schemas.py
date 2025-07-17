from pydantic import BaseModel
from typing import Optional
from datetime import date

'''Schema do Motorista'''

# Base dos campos do Motorista
class MotoristaBase(BaseModel):
    nome: str


# Schema de criação do Motorista
class MotoristaCreate(MotoristaBase):
    pass


# Schema para resposta do Motorista (O que ele vai retornar)
class Motorista(MotoristaBase):
    id: int
    placa: Optional[str] = None  # Placa do veículo associado ao motorista
    modelo: Optional[str] = None  # Modelo do veículo

    class Config:
        from_attributes = True



'''Schema do Veículo'''

# Base dos campos do Veículo
class VeiculoBase(BaseModel):
    placa: str
    modelo: str

# Schema de criação do Veículo
class VeiculoCreate(VeiculoBase):
    motorista_id: int # ID do motorista associado ao veículo


# Schema para resposta do Veículo (O que ele vai retornar)
class Veiculo(VeiculoBase):
    id: int
    nome: str # Nome do motorista associado ao veículo
    data_cadastro: Optional[date] = None  # Data de cadastro do motorista

    class Config:
        from_attributes = True
