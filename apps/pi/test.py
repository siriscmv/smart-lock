import json
import websocket
import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env file

if 'WEBSOCKET_ADDRESS' not in os.environ:
    raise Exception('WEBSOCKET_ADDRESS environment variable not set')
if 'VEHICLE_ID' not in os.environ:
    raise Exception('VEHICLE_ID environment variable not set')


websocket_address = os.environ.get('WEBSOCKET_ADDRESS') 
v_id = os.environ.get('VEHICLE_ID')

def on_message(ws, message):
    data = json.loads(message)
    if data.get('op') == 'LOCK':
        print('Locked')
        data['op'] += '_OK'
        ws.send(json.dumps(data)) 
    elif data.get('op') == 'UNLOCK':
        print('Unlocked')
        data['op'] += '_OK'
        ws.send(json.dumps(data)) 

def on_error(ws, error):
    print(error)

def on_close(ws):
    print('Connection closed')

def on_open(ws):
    print('Connection established')
    ws.send(json.dumps({'op': 'IDENTIFY', 'data': {'id': int(v_id), 'type': 'VEHICLE'}})) # type: ignore

if __name__ == '__main__':
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(websocket_address,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()