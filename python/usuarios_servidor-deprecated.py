from flask import Flask, jsonify, request
import hvac

usuarios = []
cliente = hvac.Client(url='http://127.0.0.1:8200', token='exemplo_token_nao_usar')
if not cliente.is_authenticated():
    print('Falha na autenticação!')
    exit()

app = Flask(__name__)
app.secret_key = cliente.read('secret/data/projeto_login')['data']['data']['secret_key']

@app.route('/', methods=['GET'])
def home():
    return """<h1 style="font-family: monospace">SERVIDOR RODANDO</h1>"""

@app.route('/usuarios', methods=['GET'])
def mostrar_usuarios():
    return jsonify(usuarios)
 
@app.route('/usuarios/<int:id>', methods=['GET'])
def mostrar_usuario_por_id(id):
    for usuario in usuarios:
        if usuario.get('id') == id:
            return jsonify(usuario)

@app.route('/usuarios', methods=['POST'])
def adiciona_usuario():
    novo_usuario = request.json;
    for usuario in usuarios:
        if novo_usuario['nome'] == usuario['nome'] and novo_usuario['senha'] == usuario['senha']:
            return jsonify({'codigo': 0, 'mensagem': 'Usuário já existe!'})
    
    if len(usuarios) == 0:
        novo_usuario.update({'id': 0})
    else: 
        novo_usuario.update({'id': usuarios[len(usuarios) - 1]['id'] + 1})
    usuarios.append(dict(novo_usuario))
    return {'codigo': 1, 'mensagem': 'Usuário adicionado!'}

@app.route('/usuarios/login', methods=['POST'])
def logar_usuario():
    dados = request.json
    for usuario in usuarios:
        if dados['nome'] == usuario['nome'] and dados['senha'] == usuario['senha']:
            return jsonify({'codigo': 1, 'mensagem': 'Usuário logado!'})
        elif dados['nome'] != usuario['nome'] and dados['senha'] == usuario['senha']:
            return jsonify({'codigo': 0, 'mensagem': 'Nome incorreto!'})
        elif dados['nome'] == usuario['nome'] and dados['senha'] != usuario['senha']:
            return jsonify({'codigo': 0, 'mensagem': 'Senha incorreta!'})

    return jsonify({'codigo': 1, 'mensagem': 'Usuario não existe!'})

app.run(host='localhost', port=5000, debug=True)