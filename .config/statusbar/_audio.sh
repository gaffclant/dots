#!/bin/bash

# Volume state output
VOL="$(pactl get-sink-volume 0 | awk '{ print $5 }' | tr -d '%')"
MUTE="$(pactl get-sink-mute 0 | awk '{ print $2 }')"

if [ "$VOL" -le 30 ]; then
  VOLSTATE="奄" # ﱝ
elif [ "$VOL" -le 70 ]; then
  VOLSTATE="奔"
elif [ "$VOL" -gt 70 ]; then
  VOLSTATE="墳"
fi
if [ "$MUTE" == 'yes' ]; then
  VOLSTATE="婢"
fi

echo "^C5^^B5^ ^C0^${VOLSTATE} ${VOL}%"
