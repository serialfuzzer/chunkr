const fs = require("fs");
var path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const expand = require('expand-template')()
const lineByLine = require('n-readlines');
var Helper = function () {}

var CHUNK_SIZE = 1000;

Helper.prototype = {
    createFile: function (filePath, content = '') {
        filePath = path.normalize(filePath);
        try {
            // create the file with the given content
            fs.writeFileSync(filePath, content, 'utf8');
            //console.log("File created successfully: ", filePath);
        } catch (err) {
            console.error("An error occurred while creating the file: ", err);
            throw err;
        }
    },    
    appendArrayToFile: function (array, fileName){
        fs.appendFileSync(fileName, array.join("\n")+"\n")
    },
    fileToArray: function(file){
        var content = fs.readFileSync(file);
        var array = content.toString('utf-8').split("\n").filter( e => e.length>0 );
        return array;
    },
    createDirectory: function (dirPath) {
        dirPath = path.normalize(dirPath);
        try {
            // check if the directory exists
            fs.statSync(dirPath);
            console.log("Directory already exists: ", dirPath);
        } catch(err) {
            // if the directory does not exist, create it
            if (err && err.code === 'ENOENT') {
                try {
                    fs.mkdirSync(dirPath, { recursive: true });
                    console.log("Directory created successfully: ", dirPath);
                } catch(err) {
                    console.error("An error occurred while creating the directory: ", err);
                }
            } else {
                console.error("An error occurred while checking if the directory exists: ", err);
            }
        }
    },
    mergeFiles: function(tempDir, outputFile){
        const fileList = fs.readdirSync(tempDir);
        for (const file of fileList) {
            const filePath = path.join(tempDir, file);
            var generatorObject = HelperInstance.getFileLinesInChunk(filePath);
            var lines = generatorObject.next()
            while(lines.done!=true){
                var currentChunk = lines.value;
                appendArrayToFile(currentChunk, outputFile); 
                subdomains = generatorObject.next()
            }
            
        }
        // Delete the temporary directory and its contents except the merged file
        fs.rmSync(tempDir, { recursive: true });
    },
    getFileLinesInChunk: function * (fileName){
        const liner = new lineByLine(fileName);
        let line;
        let lineNumber = 0;
        var chunk = [];
        while (line = liner.next()) {
            let currentLine = line.toString('ascii');
            if(currentLine.length != 0){
                chunk.push(currentLine)
            }
            if(chunk.length == CHUNK_SIZE){
                yield chunk
                chunk = []
            } 
            lineNumber++;
        }

        if(line == false && chunk.length > 0){
            yield chunk
        }
    },
    executeCommandAndSaveAsFile: function(commandTemplate){ // command template: subfinder -d a.com -o {output}
        return new Promise(function(resolve, reject){
            var fileName = HelperInstance.generateRandomFileName(10)+'_temp';
            var command = expand(commandTemplate, { output: fileName });
            exec(command).then(function(){
                resolve(fileName);
            }).catch(function(err){
                reject(err);
            })
        })
    },
    generateRandomName: function(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            counter += 1;
        }
        return result;
    },
    generateRandomFileName: function(length){
        var randomName = HelperInstance.generateRandomName(length);
        var filePath = "./" + randomName;
        while ( fs.existsSync(filePath) != false ){
            randomName = HelperInstance.generateRandomName(length);
        }
        return randomName;
    },
    arrayToFile: function(array){
        var fileName = HelperInstance.generateRandomFileName(6) + '_temp';
        fs.writeFileSync(fileName, array.join("\n"), {
            "flag": "w",
            "overwrite": true
        })
        return fileName;
    },
    deleteFile: function(fileName){
        try {
            fs.unlinkSync(fileName);
            return true;
        } catch {
            return false;
        }
    },
    executeCommandsInChunk: async function(fileName, command, chunkSize) {
        try {
            CHUNK_SIZE = chunkSize || 1000;
            var i = 0;
            var lineCount = 0;
            var outputFile = HelperInstance.generateRandomFileName(7) + "_finalOutput.txt";
            HelperInstance.createFile(outputFile);
            var generatorObject = HelperInstance.getFileLinesInChunk(fileName);
            var subdomains = generatorObject.next()
            while(subdomains.done!=true){
                var currentChunk = subdomains.value; // list of chunked domains
                var commandCopy = command;
                var tempFile = HelperInstance.arrayToFile(currentChunk); // chunked file
                commandCopy = commandCopy.replace('{output}', `{output}_${i}`) // output file of the current chunk
                commandCopy = expand(commandCopy, { input: tempFile })
                var file = await HelperInstance.executeCommandAndSaveAsFile(commandCopy);
                var fileContentArray = HelperInstance.fileToArray(file+`_${i}`);
                HelperInstance.appendArrayToFile(fileContentArray, outputFile);
                HelperInstance.deleteFile(file+`_${i}`);
                HelperInstance.deleteFile(tempFile);
                i++;
                lineCount += currentChunk.length;
                subdomains = generatorObject.next()
            }
            console.log(`Output saved to ${outputFile}`);
            return true;
           
        }catch (err){
            throw err;
        }
    }

}

var HelperInstance = new Helper();

module.exports = HelperInstance;