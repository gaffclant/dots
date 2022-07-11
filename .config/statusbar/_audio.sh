#!/bin/bash

# Volume state output
VOL="$(amixer get Master | awk 'NR==5 {print $4}' | sed 's/\[//;s/\]//;s/%//')"
MUTE="$(amixer get Master | awk 'NR==5 {print $6}' | sed 's/[^a-z]//g')"

if [ "$VOL" -le 30 ]; then
  VOLSTATE="奄" # ﱝ
elif [ "$VOL" -le 70 ]; then
  VOLSTATE="奔"
elif [ "$VOL" -gt 70 ]; then
  VOLSTATE="墳"
elif [ "$MUTE" == 'off' ]; then
  VOLSTATE="婢"
else
  VOLSTATE="?"
fi

echo " ${VOL}% ${VOLSTATE}  "
