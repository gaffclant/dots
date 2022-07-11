#!/bin/bash

# Defining color variables

CI=""

WI=""

DI=" "

# Fetching current CPU state
TEMP="$(sensors | grep -e 'id 0\:' | awk '{print $4}' | sed 's/[^0-9\.]//g;s/\.[0-9]//g')"

[ $TEMP -lt 30 ] && TSTATE="${CI}"
[ $TEMP -gt 30 ] && [ $TEMP -lt 70 ] && TSTATE="${WI}"
[ $TEMP -ge 70 ] && TSTATE="${DI}"

echo "${TEMP}°C ${TSTATE}  "

case $BLOCK_BUTTON in
	  1) notify-send "OASKDOASD" ;;
  esac
