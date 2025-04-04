from flask import Flask, request, jsonify
import requests

URL_servidor = 'http://localhost:5000/usuarios'

app = Flask(__name__)

@app.route('/', methods=['GET'])
def home():
    return """<h1 style="font-family: monospace">API RODANDO</h1>"""

# Cadastra usuário
@app.route('/cadastro', methods=['POST'])
def cadastra_usuario():
    dados = request.json
    try:
        resposta = requests.post(URL_servidor, json=dados)
        return resposta.json()
    except:
        return jsonify({'codigo': 0, 'mensagem': 'Falha ao enviar os dados para o servidor!'})

@app.route('/logar', methods=['POST'])
def logar_usuario():
    dados = request.json
    try:
        resposta = requests.post(f'{URL_servidor}/login', json=dados)
        return resposta.json()
    except requests.exceptions.RequestException as e:
        return jsonify({'codigo': 0, 'mensagem': e})

app.run(host='localhost', port=4000, debug=True)