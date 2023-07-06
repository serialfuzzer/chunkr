var ctrl = require("./index.js");
var helper = require("../helper");

async function bitch (){
    var data = [];
    var targets = helper.getTargetsFromFile("../hiltonSubdomains.txt");
    var x = await ctrl.getDeadDomains(targets);
    console.log(x)
    //console.log(y)
}   

    bitch()