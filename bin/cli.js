#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const spawn = require('child_process').spawn;
const exec = require('child_process').exec;
const home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
const readline = require('readline');

const rl = readline.createInterface({
	  input: process.stdin,
	  output: process.stdout
});

function ask(question){
	return new Promise((res, rej) => {rl.question(question, res)}).then(data => {
		rl.close();
		return data;
	});
}


function execute(command) {
	return new Promise(function (resolve, reject) {
			var pro = exec(command, {}, function(err, stdo, stdi){
			if(err){
				reject(err);
			} else {
	                	resolve(stdo);
	        	}
		});
	});
}



switch(process.argv[2]){
	case "init":
		console.log("Downloading files");
		let command = "git clone https://github.com/CortneyKnorr/radix.git ./";
		let arguments = process.argv.splice(2);
		if(arguments[0]){
		    command += arguments[0];
        }
		execute(command)
			.then(data => {
				return execute("rm -fr ./.git");
			})
			.then(data => {
                console.log("All done!");
                process.exit();
            })
			.catch(error => {
				console.log(error);
                process.exit();
			})
		;
		break;
	default:
		let args = ["radix.js", ...process.argv.splice(2)];
		let ls = require('child_process').spawn("node", args);
		ls.stdout.on('data', data => {
			let array = data.toString().split("\n");
			array = array.splice(0,array.length - 1);
			array.forEach(e => console.log(e));
		});
		ls.stderr.on('data', data => console.log("" + data));
		ls.on('close', (code) => {
			process.exit();
		});
}
