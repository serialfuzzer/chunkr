const cli = require("commander");
const fs = require("fs");
const process = require("process");
const helper = require("./helper");
const controller = require("./controller");
const isStdinEmpty = process.stdin.isTTY || false;



cli
.description("From a list of subdomains find dead ones")
.option("-f, --file <value>", "File to import targets from", "")
.action(async function(options){
    const fileName = options.file;
    if(options.file.length>0){
        helper.executeCommandsInChunk(options.file);
    }
    
})


cli.parse(process.argv)