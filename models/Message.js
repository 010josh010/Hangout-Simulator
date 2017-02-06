'use strict'; 
//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Message Schema definition 
const MessageSchema = new Schema({

    user:String , 

    msg:String, 

    time: String

});

//methods 


// Create the "Message" model with our MessageSchema 
const Message = mongoose.model('Message', MessageSchema);

// Export the Message model
module.exports = Message;