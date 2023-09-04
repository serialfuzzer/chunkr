#!/usr/bin/env node

const cli = require("commander");
const fs = require("fs");
const process = require("process");
const helper = require("./helper");
const controller = require("./controller");
const isStdinEmpty = process.stdin.isTTY || false;



cli
.description("Execute commands over a large file chunk by chunk")
.option("-f, --file <value>", "File to import targets from", "")
.option("-c, --command <value>", "Command to execute over a large file", "")
.option("-s, --chunkSize <value>", "Maximum ize of one chunk")
.option("-o, --outfile <value>", "Output file name")
.action(async function(options){
    const fileName = options.file;
    const command = options.command;
    const output = options.outfile;
    const chunkSize = Number(options.chunkSize);
    if(options.file.length>0 && command.length > 0){
      helper.executeCommandsInChunk(fileName, command, chunkSize, output);
    } else if ( fileName.length == 0  ) {
        cli.help();
    }
    
})


cli.parse(process.argv)