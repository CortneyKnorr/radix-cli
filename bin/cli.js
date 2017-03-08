#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
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
};


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
		execute("git clone https://github.com/CortneyKnorr/radix.git .radix")
			.then(data => execute("cp -r .radix/{app,sources,config} ./"))
			.then(data => {
				console.log("Copying files");
				return execute("cp .radix/{.gitignore,*.*} ./");
			})
			.then(data => {
				console.log("Radix files in place");
				return ask("Do you want to install dependencies?(y,n)");
			})
			.then(data => {
				if(data == 'y'){
					console.log("This may take a while");
					return execute("npm install");
				};
				return true;
			})
			.then(data => {
				console.log("Cleanup");
				return execute("rm -fr .radix");
			})
			.then(data => console.log("All done!"))
			.catch(error => {
				console.log(error);
			})
		;
		break;
	default:
		let args = ["radix.js", ...process.argv.splice(2)];
		let ls = require('child_process').spawn("node", args);
		ls.stdout.on('data', data => console.log("" + data));
		ls.stderr.on('data', data => console.log("" + data));
		ls.on('close', (code) => {
			process.exit();
		});
}
