# JeiChat - Backend

Este é o repositório do serviço de backend para o **JeiChat**, uma aplicação de chat online com foco em segurança e privacidade.

O servidor é construído em **Node.js** e implementa uma arquitetura de segurança robusta, incluindo criptografia de ponta a ponta (lógica), assinaturas digitais para autenticidade de mensagens e um sistema de prevenção de ataques de replay.

## ✨ Funcionalidades Principais

*   **API REST** para gerenciamento de usuários (cadastro, login).
*   **Servidor WebSocket** para comunicação em tempo real.
*   **Segurança em Camadas:**
    *   Autenticação baseada em **JWT**.
    *   Troca segura de chaves de sessão usando criptografia assimétrica (**RSA-OAEP**).
    *   Mensagens criptografadas com **AES-GCM**.
    *   Assinatura de mensagens com **RSA-PSS** para garantir autenticidade.
    *   Prevenção de ataques de replay com sistema de **Nonce**.
*   **Persistência de Dados** utilizando PostgreSQL (usuários), MongoDB (mensagens) e Redis (cache e sessões).
*   **Tarefa Agendada** para limpeza automática de mensagens antigas.

---

## 🚀 Rodando o Projeto Localmente

Para executar este backend em sua máquina local, você precisará ter o **Node.js**, **Docker** e **Docker Compose** instalados.

### 1. Configuração do Ambiente

Clone o repositório e instale as dependências do Node.js.

```bash
git clone https://github.com/seu-usuario/jeichat-backend.git
cd jeichat-backend
npm install
```

### 2. Variáveis de Ambiente

O projeto utiliza variáveis de ambiente para configurar as conexões com os bancos de dados. Renomeie o arquivo `.env.example` (se houver) para `.env` ou crie um novo arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
# Configurações do PostgreSQL
POSTGRES_DB_NAME=jeichat
POSTGRES_APP_USER=app_user
POSTGRES_APP_PASSWORD=senhaforteaqui

# Configurações do MongoDB
MONGO_DB_NAME=jeichat
MONGO_APP_USER=app_user
MONGO_APP_PASSWORD=senhaforteaqui

# Configurações do Redis
REDIS_PASSWORD=senhaforteaqui

# Flag para indicar ambiente Docker
DOCKER=true

# Porta externa do servidor
PORT=3000
```

### 3. Iniciando os Serviços com Docker

Este projeto utiliza Docker Compose para orquestrar os três bancos de dados (PostgreSQL, MongoDB, Redis) de forma simples e rápida.

Com o Docker em execução na sua máquina, rode o seguinte comando na raiz do projeto:

```bash
docker-compose up -d
```

Este comando irá baixar as imagens necessárias e iniciar os contêineres dos bancos de dados em segundo plano.

### 4. Iniciando o Servidor Node.js

Após os contêineres do Docker estarem em execução, você pode iniciar o servidor da aplicação:

```bash
npm run server
```

O servidor estará disponível em `http://localhost:3000` (ou na porta que você configurar).

### 5. Parando os Serviços

Para parar os contêineres dos bancos de dados, utilize:

```bash
docker-compose down
```

---

## 📜 Licença

Este projeto é distribuído sob uma licença customizada. Você tem a liberdade de usar, modificar, e distribuir este código para fins não comerciais. Você pode construir em cima dele e compartilhar suas criações, desde que não seja para uso comercial.

Para mais detalhes, entre em contato com o autor.
