//var Convert = require('ansi-to-html');

// color stuff
const blue = '\x1b[34m'; const lightblue = '\x1b[94m'; const magenta = '\x1b[35m'; const lightmagenta = '\x1b[95m';
const green = '\x1b[32m'; const lightgreen = '\x1b[92m'; const yellow = '\x1b[33m'; const lightyellow = '\x1b[93m';
const cyan = '\x1b[36m'; const lightcyan = '\x1b[96m'; const red = '\x1b[31m'; const lightred ='\x1b[91m';
const black = '\x1b[30m'; const lightblack = '\x1b[90m';

const dim = '\x1b[2m';
const normal = '\x1b[22m';
const reset = '\x1b[0m';

var colors = [blue, lightblue, cyan, lightcyan, magenta, lightmagenta,
              green, lightgreen, yellow, lightyellow, red, lightred, black, lightblack];


export function DoThing1() { return true; }
export function DoThing2() { return false; }


//var convert = new Convert();

//for (var c of colors) {
//	console.log(convert.toHtml(c));
//}


/*
blue = "#00A";
lightblue ="#55F";
cyan = "#0AA";
lightcyan = "#5FF";
magenta ="#A0A";
lightmagenta ="#F5F";
green="#0A0";
lightgreen ="#5F5";
yellow ="#A50";
lightyellow="#FF5";
red="#A00";
lightred="#F55";
black = "#000";
lightblack = "#555":


*/


//console.log(convert.toHtml('\x1b[30mblack\x1b[37mwhite'));
//console.log(convert.toHtml(lightred));
