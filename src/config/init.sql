-- cria um usuario
CREATE USER app_user WITH PASSWORD 'senhaforteaqui';

-- torna ele adm do jeichat
ALTER DATABASE jeichat_usuarios OWNER TO app_user;

-- se conecta a esse db
\c jeichat_usuarios

-- prepara para usar uuid
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- cria tabela
CREATE TABLE usuarios (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome VARCHAR(50) NOT NULL CHECK (nome !~ '^\s*$'),
    dataNascimento DATE NOT NULL CHECK (dataNascimento > '1900-01-01'),
    email TEXT UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9._]+[.][A-Za-z]+$'),
    senha_hash TEXT NOT NULL CHECK (length(senha_hash) >= 60),
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE usuarios TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;