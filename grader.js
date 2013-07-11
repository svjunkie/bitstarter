#!/usr/bin/env node
/* comments, time permitting */

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = funciton(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
    }
    return instr;
};
