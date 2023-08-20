from dotenv import load_dotenv
load_dotenv()  # load environment variables from .env file

if 'PIN_NUMBER' not in os.environ:
    raise Exception('PIN_NUMBER environment variable not set')
if 'WEBSOCKET_ADDRESS' not in os.environ:
    raise Exception('WEBSOCKET_ADDRESS environment variable not set')
if 'VEHICLE_ID' not in os.environ:
    raise Exception('VEHICLE_ID environment variable not set')

from ws_client import run_ws_client
from ble import run_ble
from threading import Thread

if __name__ == '__main__':
    ble = Thread(target=run_ble)
    ws = Thread(target=run_ws_client)

    ble.start()
    ws.start()

    ble.join()
    ws.join()