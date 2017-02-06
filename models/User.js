'use strict'; 
//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Salt = require('../services/Salt'); 

//User Schema definition 
const UserSchema = new Schema({

   userName:{
      type:String, 
      trim:true, 
      required:true, 
      unique: true

   }, 

    email: {
    type: String,
    unique: true, 
    required: true, 
    match: [/.+\@.+\..+/, "Please enter a valid e-mail address"]
  },

   password:{
      type:String, 
      trim:true, 
      required:true,
      validate:[
          function(input){
            return input.length >= 8 ; 
          } , 

          'Password should be at least 8 characters' 
      ]

   }, 
   //lounge that the user is joined to 
   friends:[{
      //type is set to the object id since lounges can have the same name 
      type:Schema.Types.ObjectId,
      ref: 'User' 
   }], 

   userCreated:{
      type: Date, 
      default: Date.now(), 
      lastUpdated: { type: Date }
   }

});

//Schema methods 
UserSchema.methods.salt = function(pwd){
   return this.password = Salt(pwd); 
}

// Create the "User" model with our UserSchema schema
const User = mongoose.model('User', UserSchema);

// Export the User model
module.exports = User;