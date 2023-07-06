const dns = require("dns");
const axios = require("axios");
const helper = require("../helper")
const Controller = function() {}

var options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:77.0) Gecko/20190101 Firefox/77.0'
    }
}

Controller.prototype = {
    
    lookupPromise: async function(subdomain){
        return new Promise((resolve, reject) => {
            dns.lookup(subdomain, (err, address) => {
                if(err) reject(err);
                resolve(address);
            });
        });
    },
    
    getDeadDomains: async function(subdomains){ 
        // get domains that don't have an IP address or DNS 'A' Record
        var resolved=0;
        var deadDomains = []; 
        for( var i =0 ; i<subdomains.length; i++ ){
            try {
                resolved++;
                var ip = await this.lookupPromise(subdomains[i]);
            } catch (e){
                deadDomains.push(subdomains[i])
            }
        }
        return deadDomains;
    }
    
}

ControllerInstance = new Controller();

module.exports = ControllerInstance;