const cli = require("commander");
const fs = require("fs");
const process = require("process");
const helper = require("./helper");
const controller = require("./controller");
const isStdinEmpty = process.stdin.isTTY || false;



cli
.description("From a list of subdomains find dead ones")
.option("-f, --file <value>", "File to import targets from", "")
.option("-c, --command <value>", "Command to execute over a large file", "")
.action(async function(options){
    const fileName = options.file;
    const command = options.command;

    if(options.file.length>0 && command.length > 0){
        helper.executeCommandsInChunk(fileName, command);

    } else if ( fileName.length == 0  ) {
        cli.help();
    }
    
})


cli.parse(process.argv)