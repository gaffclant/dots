#
# ~/.bashrc
#


export XDG_RUNTIME_DIR=$HOME/.local/run
export EDITOR=nvim
export GPG_TTY=$(tty)
export PATH=/home/gaffclant/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl
export PATH=$PATH:/home/gaffclant/bin:/home/gaffclant/bin:/usr/local/sbin:/usr/local/bin:/usr/bin:/usr/lib/jvm/default/bin:/usr/bin/site_perl:/usr/bin/vendor_perl:/usr/bin/core_perl:/home/gaffclant/.local/bin:/usr/share/fonts/:/home/gaffclant/.local/share/gem/ruby/3.0.0/bin:$HOME/.cargo/env
export PATH=$PATH:/home/gaffclant/.rustup/toolchains/nightly-x86_64-unknown-linux-gnu/bin
export PATH=$PATH:/home/gaffclant/.local/opt/cross/bin:/home/gaffclant/.config/nvim/bin
export DOTNET_ROOT=~/Programming/dotnet/
export PATH=$PATH:~/Programming/dotnet/

alias ..="cd .."
alias ...="cd ../.."
alias theme='sudo theme'
alias nix-init='. /home/gaffclant/.nix-profile/etc/profile.d/nix.sh'
alias ride='/home/gaffclant/github/ride/_/ride45/Ride-4.5-linux-x64/Ride-4.5'
alias dyapl='sudo docker run -e RIDE_INIT=serve:*:4502 -p 4502:4502 dyalog/dyalog'
alias rm='rm -i'
alias vim='nvim'
alias ls='eza -l --git --group-directories-first --icons'
alias la='eza -la --git --group-directories-first --icons'
alias lsg='eza -l --git --git-ignore --group-directories-first --icons'
alias lag='eza -la --git --git-ignore --group-directories-first --icons'
alias gpdf='groff -Tpdf -ms'
alias playlist='mpv --no-video --shuffle *'
alias vi="vim"
alias shutnow='sudo shutdown -P now'
alias bat='bat --theme ansi'
alias music='tmux new-session -s $$ "tmux source-file ~/.ncmpcpp/tsession"'
alias day='sudo theme day'
alias night='sudo theme night'
alias feh="feh --image-bg black -Z -."
alias discordo="discordo --token=$(cat ~/.discord_token)"
alias cargo="cargo-mommy"

# If not running interactively, don't do anything
[[ $- != *i* ]] && return
# Use bash-completion, if available
[[ $PS1 && -f /usr/share/bash-completion/bash_completion ]] &&
	. /usr/share/bash-completion/bash_completion



function cd {
	builtin cd "$@" && eza -l --group-directories-first --icons
}

parse_git_branch() {
	git branch 2>/dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
PS1="\[\033[1;35m\]\w\[\033[1;33m\]\$(parse_git_branch) \[\033[1;36m\]\[\033[0;0m\] "
. $HOME/.cargo/env
export CARGO_MOMMYS_LITTLE="boy"
export CARGO_MOMMYS_MOODS="yikes"
export SHELL_MOMMYS_LITTLE="boy"
set -o vi
source /home/gaffclant/.config/alacritty/alacritty/extra/completions/alacritty.bash
