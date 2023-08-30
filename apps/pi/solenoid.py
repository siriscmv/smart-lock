import RPi.GPIO as GPIO
import os

pin_number = int(os.environ.get('PIN_NUMBER'))   # type: ignore

def unlock():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(pin_number, GPIO.OUT)

# cleanup() sets all used pins back to INPUT mode
# This is needed because setting the pin to LOW mode will still emit some small amount of voltage which is enough to trigger the relay
# Setting it to INPUT (done by cleanup()) rather than low will completely get rid of the voltage
def lock():
    GPIO.cleanup()

def handle_password(dbus_bytes):
    str_val = bytes([byte for byte in dbus_bytes]).decode('utf-8')
    split = str_val.split("|")
    password, action = split[0], split[1]
    try:
        with open("pwd", "r+") as file:
            passwords = file.read().split("\n")
            if password not in passwords: return

            new_passwords = [p for p in passwords if p != password]
            file.seek(0)
            file.truncate()
            file.write("\n".join(new_passwords))

            if (action == "LOCK"): lock()
            else: unlock()
    except Exception as e: print("An error occurred:", e)