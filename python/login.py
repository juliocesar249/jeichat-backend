from PySimpleGUI import PySimpleGUI as sg
import requests

url = 'http://localhost:5000/api/usuarios/login'

sg.theme('Dark Blue 3')
layout = [
    [sg.Text('Email:', font=('monospace', 15)), sg.Input(key='email', size=(20, 1), font=('monospace', 15))],
    [sg.Text('Senha:', font=('monospace', 15)), sg.Input(key='senha', password_char='*', size=(20, 1), font=('monospace', 15))],
    [sg.Button('Entrar', key='logar', font=('Monospace', 15))]
]

janela = sg.Window('Login', layout)

while True:
    evento, valores = janela.read()
    if evento == sg.WINDOW_CLOSED:
        break;
    
    if evento == 'logar' and len(valores['email']) == 0 or len(valores['senha']) == 0:
        sg.popup('Preencha todos os campos', title='Aviso', text_color='white', background_color='red')
    else:
        login = {'email': valores['email'], 'senha': valores['senha']}
        try:
            resposta = requests.post(url, json=login)
            sg.popup(resposta.json()['mensagem'], title='Aviso', font=('Monospace', 15))
        except requests.exceptions.RequestException as e:
            print(f'Falha ao enviar os dados: {e}')