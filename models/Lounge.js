'use strict'; 
//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Lounge Schema definition 
const LoungeSchema = new Schema({

   name:{
      type:String, 
      trim: true, 
      required:true
   }, 

   userRef:{
      type:Schema.Types.ObjectId,
      trim:true, 
      required:true, 
      ref: 'User' 
   },

   loungeCreated:{
      type: Date, 
      default: Date.now() 
   }

});

// Create the "Lounge" model with our LoungeSchema 
const Lounge= mongoose.model('Lounge', LoungeSchema);

// Export the Lounge model
module.exports = Lounge;