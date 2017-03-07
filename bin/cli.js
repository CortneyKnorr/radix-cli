#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
var spawn = require('child_process').spawn;
var home = process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];

let args = ["radix.js", ...process.argv.splice(2)];

let ls = require('child_process').spawn("node", args);


ls.stdout.on('data', data => console.log("" + data));

ls.stderr.on('data', data => console.log("" + data));
