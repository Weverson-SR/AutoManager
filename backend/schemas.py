from pydantic import BaseModel

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

    class Config:
        from_attributes = True



'''Schema do Veículo'''

# Base dos campos do Veículo
class VeiculoBase(BaseModel):
    placa: str

# Schema de criação do Veículo
class VeiculoCreate(VeiculoBase):
    motorista_id: int # ID do motorista associado ao veículo


# Schema para resposta do Veículo (O que ele vai retornar)
class Veiculo(VeiculoBase):
    id: int
    motorista: Motorista # Motorista associado ao veículo

    class Config:
        from_attributes = True
