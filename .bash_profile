# .bash_profile

# Get the aliases and functions
[ -f $HOME/.bashrc ] && . $HOME/.bashrc
[[ -z $DISPLAY ]] && [[ "$(tty)" == "/dev/tty1" ]] && exec startx
. "$HOME/.cargo/env"
