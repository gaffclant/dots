#!/bin/bash

# Wifi SSID and strengh

STR="$(grep wlo1 /proc/net/wireless | awk '{print $4}' | sed 's/[^0-9]//g')"
STR=$((STR-30))
SSID="$(iw dev | grep ssid | awk '{print $2}')"
#VPN=$(mullvad status)

[ "$STR" -lt 35 ] && ICON=""
[ "$STR" -ge 35 ] && ICON=""
[ "$STR" -ge 55 ] && ICON=""

#if [ $VPN != "Disconnected" ]; then
#	VPNSTATUS="ON"
#else
#	VPNSTATUS="OFF"
#fi

curl www.google.com.br &>/dev/null || ICON=""

[ -z $SSID ] && SSID="off" && ICON=""

echo "${ISTATE}${SSID} ${ICON}"
