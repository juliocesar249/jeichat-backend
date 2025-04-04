# import secrets

# dici = {}
# nome = 'julio'
# SESSIONS = {}

# try:
#     if not nome or dici[nome] != nome:
#         print('erro')
# except Exception as e:
#     print('a')

# session_id = secrets.token_hex(16)  # Gera ID temporário
# SESSIONS[session_id] = {"email": 'email@teste.com', "step": 1}

# session = SESSIONS.get(secrets.token_hex(16))
# if not session or session["step"] != 1:
#     print('erro')

# dici[nome] = nome

# print(SESSIONS)



import hvac

client = hvac.Client(
    url="http://127.0.0.1:8200",
    token="exemplo_token_nao_usar"
)

secret = client.secrets.kv.read_secret_version(path='projeto_login')
secret_key = secret['data']['data']['secret_key']

print(secret_key)