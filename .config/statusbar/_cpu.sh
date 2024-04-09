#!/bin/bash

# Defining color variables

CI=""

WI=""

DI=""

# Fetching current CPU state
TEMP="$(sensors | grep -e 'CPU Temp' | awk '{print $3}' | sed 's/[^0-9\.]//g;s/\.[0-9]//g')"

[ $TEMP -lt 30 ] && TSTATE="${CI}"
[ $TEMP -ge 30 ] && [ $TEMP -lt 70 ] && TSTATE="${WI}"
[ $TEMP -ge 70 ] && TSTATE="${DI}"

echo "^C3^^B3^ ^C0^${TSTATE} ${TEMP}°C"

case $BLOCK_BUTTON in
	  1) notify-send "OASKDOASD" ;;
  esac
