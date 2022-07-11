#Kill process to update audio

kill "$(pstree -lp | grep -- -statusbar.sh\([0-9] | sed "s/.*sleep(\([0-9]\+\)).*/\1/")"
