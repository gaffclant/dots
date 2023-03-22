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

if [ -d /etc/X11/xinit/xinitrc.d ] ; then
 for f in /etc/X11/xinit/xinitrc.d/?*.sh ; do
  [ -x "$f" ] && . "$f"
 done
 unset f
fi

dwmblocks 2>&1 >/dev/null &

bash $HOME/.fehbg
pipewire &
picom --experimental-backends &
xrandr
xrdb -merge .Xresouces &
dunst -config /home/gaffclant/.config/dunstrc &
mpd &
eww daemon &

exec dbus-run-session dwm
