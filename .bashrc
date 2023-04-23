#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return
# Use bash-completion, if available
[[ $PS1 && -f /usr/share/bash-completion/bash_completion ]] && \
    . /usr/share/bash-completion/bash_completion

alias nix-init='. /home/gaffclant/.nix-profile/etc/profile.d/nix.sh'
alias ride='/home/gaffclant/github/ride/_/ride45/Ride-4.5-linux-x64/Ride-4.5'
alias dyapl='sudo docker run -e RIDE_INIT=serve:*:4502 -p 4502:4502 dyalog/dyalog'
alias rm='rm -i'
alias vim='nvim'
alias ls='ls --color=auto'
alias gpdf='groff -Tpdf -ms'
alias playlist='mpv --no-video --shuffle *'
alias vi="vim"
alias shutnow='sudo shutdown -P now'
alias bat='bat --theme ansi'
alias music='tmux new-session -s $$ "tmux source-file ~/.ncmpcpp/tsession"'

export XDG_RUNTIME_DIR=$HOME/.local/run
export EDITOR=nvim


function cd {
    builtin cd "$@" && ls -F
}

parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
PS1="\[\033[1;35m\]\w\[\033[1;33m\]\$(parse_git_branch) \[\033[1;36m\]\[\033[0;0m\] "
PATH=/home/gaffclant/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl
PATH=/home/gaffclant/bin:/home/gaffclant/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/home/gaffclant/.local/bin:/usr/share/fonts/:/home/gaffclant/.local/share/gem/ruby/3.0.0/bin:$HOME/.cargo/env

test -r "/home/gaffclant/.dir_colors" && eval $(dircolors /home/gaffclant/.dir_colors)
. "$HOME/.cargo/env"
