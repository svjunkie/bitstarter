#!/usr/bin/env node
/* comments, time permitting */

var util = require('util');
var fs = require('fs');
var program = require('commander');
var rest = require('restler');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
	console.log("%s does not exist. Exiting.", instr);
	process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var assertUrlExists = function(url) {
    //see http://stackoverflow.com/questions/17544662/node-js-callback-asynch-commandline/
};

var checkUrl = function(url, checksfile) {
    var handleUrl = function(result, response) {
	if (result instanceof Error) {
	    console.error('Error: ' + util.format(response.message));
	} else {
	    console.error("Successfully Pulled URL %s", url);
	    return(checkHtmlFile(result, checksfile));
	}
    };
    rest.get(url).on('complete',handleUrl);
};

var outputJson = function(json) {
 var outJson = JSON.stringify(json, null, 4);
 return outJson;    
};

if(require.main == module) {
    program
       .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
       .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
       .option('-u, --url <html_url>', 'URL to index.html')
       .parse(process.argv);
    if(program.file) {
	var checkJson = checkHtmlFile(program.file, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
    } else if(program.url) {
	var checkJson = checkUrl(program.url, program.checks);
	var outJson = JSON.stringify(checkJson, null, 4);
    }

    console.log(outJson);

//    var checkJson = checkHtmlFile(program.file, program.checks);
//    var outJson = JSON.stringify(checkJson, null, 4);
//    rest.get(program.url).on('complete', function(result) {
//	console.log(outJson);
//    });
//    console.log(outJson);
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
