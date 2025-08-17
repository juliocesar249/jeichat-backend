-- cria um usuario
CREATE USER app_user WITH PASSWORD 'senhaforteaqui';

-- torna ele adm do jeichat
ALTER DATABASE jeichat OWNER TO app_user;

-- se conecta a esse db
\c jeichat

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

CREATE TABLE chaves_publicas (
    id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    chave      VARCHAR(600) NOT NULL,
    id_usuario UUID UNIQUE REFERENCES usuarios (id) ON DELETE CASCADE,
    criado_em  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE nonces_usuario (
    id         SERIAL PRIMARY KEY,
    nonce      TEXT NOT NULL,
    id_usuario UUID REFERENCES usuarios (id) ON DELETE CASCADE NOT NULL,
    criado_em  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (nonce, id_usuario)
);

CREATE TABLE tarefas_agendadas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    nome_tarefa VARCHAR(255) NOT NULL,
    proxima_execucao TIMESTAMPTZ NOT NULL,
    status VARCHAR(255) DEFAULT 'AGENDADO' CHECK (status IN ('AGENDADO', 'EXECUTANDO', 'EXECUTADO', 'FALHOU'))
);

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE usuarios TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE chaves_publicas TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE nonces_usuario TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE tarefas_agendadas TO app_user;