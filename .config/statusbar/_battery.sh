#!/bin/bash

# Battery stuff

CAP="$(cat /sys/class/power_supply/BAT0/capacity)"
STATUS="$(cat /sys/class/power_supply/BAT0/status)"


if [ "$STATUS" = "Full" ]; then
  ICON=""; 
elif [ "$STATUS" = "Discharging" ]; then
    if [ "$CAP" -ge 90 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 80 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 70 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 60 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 50 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 40 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 30 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 20 ]; then
        ICON=""; 
    elif [ "$CAP" -ge 10 ]; then
        ICON=""; 
    else
        ICON=""; 
	notify-send -u critical 'Low Battery'
    fi
elif [ "$STATUS" = "Not charging"  ]; then
    ICON=""
elif [ "$STATUS" = "Charging" ]; then
    ICON=""
fi

echo "${CAP}% ${ICON}"
