//Modify this file to change what commands output to your statusbar, and recompile using the make command.
static const Block blocks[] = {
	/*Icon*/	/*Command*/		/*Update Interval*/	/*Update Signal*/
	{"", "~/.config/statusbar/_music.sh",		1,		0},
	{"", "~/.config/statusbar/_audio.sh",		1,		0},
	{"", "~/.config/statusbar/_date.sh",		3600,		1},
	{"", "~/.config/statusbar/_displaytime.sh",	1,		0},

};

//sets delimeter between status commands. NULL character ('\0') means no delimeter.
static char delim[] = " | ";
static unsigned int delimLen = 3;
