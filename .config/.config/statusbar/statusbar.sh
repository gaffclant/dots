#!/bin/bash

# This is the wrapper script for all status bar functions, all contents are
# imported by the main function

main() {
. ~/.config/dwm/statusbar/_music.sh;
. ~/.config/dwm/statusbar/_wifi.sh ;
. ~/.config/dwm/statusbar/_battery.sh ;
. ~/.config/dwm/statusbar/_displaytime.sh ;
}

while true;
    do xsetroot -name "$(main | tr "\n" " ")"
        sleep 1;
done;
