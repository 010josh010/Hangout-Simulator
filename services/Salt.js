const crypto = require('crypto');

const Salt = function(pwd){
    const hash = crypto.createHmac('sha256', pwd)
                   .update('cookie Monster')
                   .digest('hex');
    return hash ; 
}; 


module.exports = Salt; 