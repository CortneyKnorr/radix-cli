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
	case "update":
		console.log("Downloading files");
		execute("git clone https://github.com/CortneyKnorr/radix.git .radix")
			.then(data => execute("cp -r .radix/app ./"))
			.then(data => {
				console.log("Copying files");
				return execute("cp .radix/{package.json,radix.js} ./");
			})
			.then(data => {
				console.log("Cleanup");
				return execute("rm -fr .radix");
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
			.then(data => {
                console.log("All done!")
                process.exit();
            })
			.catch(error => {
				console.log(error);
                process.exit();
			})
		;
		break;
    case "dependencies":
        console.log("Installing global dependencies");
        execute("sudo npm install -g nodemon")
            .then(data => {
                console.log("30% finished");
                return execute("sudo npm install -g browser-sync");
            })
            .then(data => {
                console.log("60% finished");
                return execute("sudo npm install -g n");
            })
            .then(data => {
                console.log("90% finished");
                return execute("sudo n stable");
            })
            .then(data => {
                console.log("Finished");
                process.exit();
            })
            .catch(data => {
                console.log(data);
                console.log("Something went wrong");
            })
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
