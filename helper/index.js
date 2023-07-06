const fs = require("fs");
var path = require("path");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const expand = require('expand-template')()
const lineByLine = require('n-readlines');
var Helper = function () {}

Helper.prototype = {
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
            if(chunk.length == 1000){
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
    executeCommandsInChunk: async function(fileName) {
        try {
            var i = 0;
            var lineCount = 0;
            var generatorObject = HelperInstance.getFileLinesInChunk(fileName);
            var subdomains = generatorObject.next()
            while(subdomains.done!=true){
                var currentChunk = subdomains.value; // list of chunked domains
                var tempFile = HelperInstance.arrayToFile(currentChunk);
                var command = `cat ${tempFile} | httpx -t 500 -status-code -title -silent -nc -p https:9200 -o output/{output}_${i}`;
                var file = await HelperInstance.executeCommandAndSaveAsFile(command);
                HelperInstance.deleteFile(tempFile);
                i++;
                lineCount += currentChunk.length;
                subdomains = generatorObject.next()
            }
            return true;
        }catch (err){
            throw err;
        }
    }

}

var HelperInstance = new Helper();

module.exports = HelperInstance;