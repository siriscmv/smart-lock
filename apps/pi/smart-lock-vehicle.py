import RPi.GPIO as GPIO
import json
import websocket
import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env file

if 'PIN_NUMBER' not in os.environ:
    raise Exception('PIN_NUMBER environment variable not set')
if 'WEBSOCKET_ADDRESS' not in os.environ:
    raise Exception('WEBSOCKET_ADDRESS environment variable not set')
if 'VEHICLE_ID' not in os.environ:
    raise Exception('VEHICLE_ID environment variable not set')


pin_number = int(os.environ.get('PIN_NUMBER'))   # type: ignore
websocket_address = os.environ.get('WEBSOCKET_ADDRESS') 
v_id = os.environ.get('VEHICLE_ID')

def unlock():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin_number, GPIO.OUT)

# cleanup() sets all used pins back to INPUT mode
# This is needed because setting the pin to LOW mode will still emit some small amount of voltage which is enough to trigger the relay
# Setting it to INPUT (done by cleanup()) rather than low will completely get rid of the voltage
def lock():
    GPIO.cleanup()

def on_message(ws, message):
    data = json.loads(message)
    if data.get('op') == 'LOCK':
        lock()
        data['op'] += '_OK'
        ws.send(json.dumps(data))
    elif data.get('op') == 'UNLOCK':
        unlock()
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