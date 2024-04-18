import RPi.GPIO as GPIO
import json
import websocket
import os
from solenoid import lock, unlock, wait_for_handshake
from ble import run_ble

websocket_address = os.environ.get('WEBSOCKET_ADDRESS') 
v_id = os.environ.get('VEHICLE_ID')

def on_message(ws, message):
    data = json.loads(message)
    bypass = data.get('__BYPASS_HANDSHAKE')

    if data.get('op') == 'LOCK':
        try:
            if not bypass: 
                if not wait_for_handshake(): raise Exception("Handshake failed")
            lock()

            data['op'] += '_OK'
            if not bypass: ws.send(json.dumps(data))
        except Exception as e:
            data['op'] += '_FAIL'
            data['error'] = str(e)
            if not bypass: ws.send(json.dumps(data))
    elif data.get('op') == 'UNLOCK':
        try:
            if not bypass: 
                if not wait_for_handshake(): raise Exception("Handshake failed")
            unlock()

            data['op'] += '_OK'
            if not bypass: ws.send(json.dumps(data))
        except Exception as e:
            data['op'] += '_FAIL'
            data['error'] = str(e)
            if not bypass: ws.send(json.dumps(data))
    elif data.get('op') == 'ADD_OTP':
        with open("/home/pi/pwd", "a") as file:
            file.write(data.get('password') + "\n")
        data['op'] += '_SUCCESS'
        ws.send(json.dumps(data))

def on_error(ws, error):
    print(error)

def on_close(ws):
    print('Connection closed')

def on_open(ws):
    print('Connection established')
    ws.send(json.dumps({'op': 'IDENTIFY', 'data': {'id': int(v_id), 'type': 'VEHICLE'}})) # type: ignore

def run_ws_client():
    websocket.enableTrace(True)

    # Ensure lock is engaged on startup
    try: lock()
    except Exception as e: pass

    ws = websocket.WebSocketApp(websocket_address,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()