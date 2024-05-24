#!/bin/bash
TIT=$(mpc current)
if [[ "${#TIT}" -gt 0 ]] then
  echo "^C1^^B1^ ^C0^ﱘ $TIT"
else
  echo ""
fi
