import RPi.GPIO as GPIO
import os

pin_number = int(os.environ.get('PIN_NUMBER'))   # type: ignore

is_unlocked = False

def unlock():
    global is_unlocked
    if is_unlocked: raise Exception("Already unlocked")

    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin_number, GPIO.OUT)

    is_unlocked = True

# cleanup() sets all used pins back to INPUT mode
# This is needed because setting the pin to LOW mode will still emit some small amount of voltage which is enough to trigger the relay
# Setting it to INPUT (done by cleanup()) rather than low will completely get rid of the voltage
def lock():
    global is_unlocked
    if not is_unlocked: raise Exception("Already locked")

    GPIO.cleanup() 

    is_unlocked = False

def handle_handshake():
    complete_handshake()

def handle_password(dbus_bytes):
    str_val = bytes([byte for byte in dbus_bytes]).decode('utf-8')
    split = str_val.split("|")
    password, action = split[0], split[1]
    try:
        with open("/home/pi/pwd", "r+") as file:
            passwords = file.read().split("\n")
            if password not in passwords: return

            if (action == "LOCK"): lock()
            else: unlock()

            new_passwords = [p for p in passwords if p != password]
            file.seek(0)
            file.truncate()
            file.write("\n".join(new_passwords))

            
    except Exception as e: print("An error occurred:", e)

event = threading.Event()

# Blocks the normal flow
def wait_for_handshake():
    print("Waiting for event...")
    if event.wait(timeout=15):
        print("Event has been set!")
        event.clear()
    else:
        print("Timeout occurred, event not set within the specified timeout.")

# called by BLE module
def complete_handshake():
    print("Setting event...")
    event.set()