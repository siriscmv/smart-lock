SCRIPT=$(find ~ | grep smart-lock-vehicle.py)

echo "@reboot python $SCRIPT" | sudo crontab -