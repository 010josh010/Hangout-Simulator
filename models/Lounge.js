'use strict'; 
//dependencies
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Lounge Schema definition 
const LoungeSchema = new Schema({

   name:{
      type:String, 
      trim: true, 
      required:true, 
      validate:[
          function(name){
            return name.length < 12 ; 
          } , 

          'Lounge name can\'t be more than 12 characters' 
      ]
   }, 

   messages:[{
      type: Schema.Types.ObjectId, 
      ref: 'Message'
   }],  

   loungeCreated:{
      type: Date, 
      default: Date.now() 
   }

});

//methods 


// Create the "Lounge" model with our LoungeSchema 
const Lounge= mongoose.model('Lounge', LoungeSchema);

// Export the Lounge model
module.exports = Lounge;