#!/bin/sh
export _JAVA_AWT_WM_NONREPARENTING=1
userresources=$HOME/.Xresources
usermodmap=$HOME/.Xmodmap
sysresources=/etc/X11/xinit/.Xresources
sysmodmap=/etc/X11/xinit/.Xmodmap

# merge in defaults and keymaps

if [ -f $sysresources ]; then
	xrdb -merge $sysresources
fi

if [ -f $sysmodmap ]; then
	xmodmap $sysmodmap
fi

if [ -f "$userresources" ]; then
	xrdb -merge "$userresources"
fi

if [ -f "$usermodmap" ]; then
	xmodmap "$usermodmap"
fi

# start some nice programs

if [ -d /etc/X11/xinit/xinitrc.d ]; then
	for f in /etc/X11/xinit/xinitrc.d/?*.sh; do
		[ -x "$f" ] && . "$f"
	done
	unset f
fi

dwmblocks 2>&1 >/dev/null &

picom --experimental-backends &
#bash $HOME/.screenlayout/main.sh &
xrdb -merge .Xresouces &
dunst -config /home/gaffclant/.config/dunstrc &
eww daemon &
pipewire &
mpd &
bash $HOME/.fehbg
#xwinwrap -fs -fdt -ni -b -nf -un -o 1.0 -debug -- mpv -wid 0 --loop --no-audio ~/Videos/life_death.mp4
xset -dpms &
xset s off &

# Swap escape key and caps lock
setxkbmap -option caps:swapescape &
xrandr --output DisplayPort-0 --primary --mode 2560x1440 --rate 143.97

while true; do
	dbus-run-session dwm 2>/dev/null
done
