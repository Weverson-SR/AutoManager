from fastapi import FastAPI, Depends, HTTPException
from . import services, models, schemas
from .database import get_db, engine
from sqlalchemy.orm import Session

# iniciar a FASTAPI
app = FastAPI()


@app.get("/motoristas/", response_model=list[schemas.Motorista])
async def get_all_motoristas(db: Session = Depends(get_db)):
    """
    Retorna todos os motoristas cadastrados.
    """
    return services.get_motoristas(db)

@app.get("/motoristas/{motorista_id}", response_model=schemas.Motorista)
async def get_motorista_by_id(motorista_id: int, db: Session = Depends(get_db)):
    """
    Retorna um motorista específico pelo ID.
    """
    motorista_queryset = services.get_motorista(db, motorista_id)
    if motorista_queryset:
         return motorista_queryset
    raise HTTPException(status_code=404, detail="Motorista não encontrado")

@app.post("/motoristas/", response_model=schemas.Motorista)
async def create_new_motorista(motorista: schemas.MotoristaCreate, db: Session = Depends(get_db)):
    """
    Cria um novo motorista.
    """
    return services.create_motorista(db, motorista)

@app.put("/motoristas/{motorista_id}", response_model=schemas.Motorista)
async def update_motorista(motorista_id: int, motorista: schemas.MotoristaCreate, db: Session = Depends(get_db)):
    """
    Atualiza um motorista existente.
    """
    db_updated_motorista = services.update_motorista(db, motorista, motorista_id)
    if not db_updated_motorista:
        raise HTTPException(status_code=404, detail="Motorista não encontrado")
    return db_updated_motorista

@app.delete("/motoristas/{motorista_id}", response_model=schemas.Motorista)
async def delete_motorista(motorista_id: int, db: Session = Depends(get_db)):
    """
    Deleta um motorista pelo ID.
    """
    db_deleted_motorista = services.delete_motorista(db, motorista_id)
    if db_deleted_motorista:
        return db_deleted_motorista
    raise HTTPException(status_code=404, detail="Motorista não encontrado")
    
