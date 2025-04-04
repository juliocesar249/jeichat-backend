from PySimpleGUI import PySimpleGUI as sg
import requests

url = 'http://localhost:3000/cadastro'

#layout cadastro
sg.theme('Reddit')
layout = [
    [sg.Text('Nome de usuário'), sg.Input(key='nome', size=(20, 1))],
    [sg.Text('Senha'), sg.Input(key='senha', password_char='*', size=(20, 1))],
    [sg.Button('Cadastrar', key='cadastrar')]
]

janela = sg.Window('Tela de cadastro', layout)

while True:
    evento, valores = janela.read()
    if evento == sg.WINDOW_CLOSED:
        break;
    else:
        if evento == 'cadastrar' and len(valores['nome']) == 0 or len(valores['senha']) == 0:
            sg.popup('Preencha todos os campos', title='Aviso', text_color='white', background_color='red')
        else:
            novo_usuario = {'nome': valores['nome'], 'senha': valores['senha']}
            try:
                resposta = requests.post(url, json=novo_usuario, timeout=20)
                if resposta.json()['codigo'] == 1:
                    sg.popup('Usuário cadastrado!', title='Aviso')
                elif resposta.json()['codigo'] == 0:
                    sg.popup(f'{resposta.json()['mensagem']}', title='Aviso')
                else:
                    sg.popup(f'{resposta.json()['mensagem']}', title='Aviso')
            
            except requests.exceptions.RequestException as e:
                print(f'Erro ao enviar dados: {e}')
        
