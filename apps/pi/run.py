import RPi.GPIO as GPIO
import time
import json
import websocket
import os
from dotenv import load_dotenv

load_dotenv()  # load environment variables from .env file

if 'PIN_NUMBER' not in os.environ:
    raise Exception('PIN_NUMBER environment variable not set')
if 'WEBSOCKET_ADDRESS' not in os.environ:
    raise Exception('WEBSOCKET_ADDRESS environment variable not set')

pin_number = int(os.environ.get('PIN_NUMBER'))   # type: ignore
websocket_address = os.environ.get('WEBSOCKET_ADDRESS') 

GPIO.setmode(GPIO.BCM)  # set board mode to Broadcom
GPIO.setup(pin_number, GPIO.OUT)  # set up pin for output

def on_message(ws, message):
    data = json.loads(message)
    if data.get('op') == 'lock':
        GPIO.output(pin_number, GPIO.LOW)  # turn relay on
    elif data.get('op') == 'unlock':
        GPIO.output(pin_number, GPIO.HIGH)  # turn relay off

def on_error(ws, error):
    print(error)

def on_close(ws):
    print('Connection closed')

def on_open(ws):
    print('Connection established')

if __name__ == '__main__':
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp(websocket_address,
                                on_message=on_message,
                                on_error=on_error,
                                on_close=on_close)
    ws.on_open = on_open
    ws.run_forever()