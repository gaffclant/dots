#!/bin/bash
COVER="/tmp/.music_cover.jpg"

get_cover() {
    STATUS="$(mpc status)"
    COVER="/tmp/.music_cover.jpg"
    MUSIC_DIR="$HOME/Music"
	ffmpeg -i "${MUSIC_DIR}/$(mpc current -f %file%)" "${COVER}" -y &> /dev/null
	STATUS=$?

	# Check if the file has a embbeded album art
	if [ "$STATUS" -eq 0 ];then
		echo "$COVER"
	else
		echo "images/music.png"
	fi
}

if [ ! -f "$COVER" ]; then
  cp "$HOME/.ncmpcpp/default_cover.png" "$COVER"
fi
old="/tmp/.music_cover.old.jpg"

refresh() {
    cp $COVER $old
    clear
    img2sixel $COVER -w 620
    tput civis --
}
#rerender image when changed
refresh
while  true; do
  #TODO: Make it check if music is actually playing
  COVER=$(get_cover);
  cmp --silent $old $COVER || refresh
done
