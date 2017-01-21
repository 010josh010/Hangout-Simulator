const crypto = require('crypto');

const makeHash = function(secret){
    const hash = crypto.createHmac('sha256', secret)
                   .update('cookie monster')
                   .digest('hex');
    return hash ; 
}; 


module.exports = makeHash ; 

let newHash = makeHash('burger'); 

console.log(newHash); 
