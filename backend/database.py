from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

# Carrega o arquivo .env
load_dotenv()

# Obtém a URL do banco de dados do ambiente
DATABASE_URL = os.getenv("DATABASE")

# Cria a conexão com o banco de dados
engine = create_engine(DATABASE_URL)

# Cria a sessão para interagir com o banco de dados
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base declarativa para os modelos
Base = declarative_base()

# função que vai ter a sessão do banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# função para criar a tabela no banco de dados
def create_tables():
    Base.metadata.create_all(bind=engine)
    print("Tabelas criadas com sucesso!")
