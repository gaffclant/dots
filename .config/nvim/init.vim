syntax enable

call plug#begin(stdpath('data') . '/plugged')

Plug 'catppuccin/nvim', {'as': 'catppuccin'}

call plug#end()

colorscheme catppuccin
