SCRIPT=$(find ~ | grep smart-lock-vehicle.py)

echo "@reboot python $SCRIPT >~/CRONLOG 2>&1" | sudo crontab -