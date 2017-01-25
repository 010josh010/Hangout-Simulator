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


   members: [{
    type: Schema.Types.ObjectId,
    // The ObjectIds will refer to the ids in the User model
    ref: 'User'
  }], 

   loungeCreated:{
      type: Date, 
      default: Date.now() 
   }

});

//methods 
LoungeSchema.methods.addMember = function(userId){
   this.members.push(userId); 
}

// Create the "Lounge" model with our LoungeSchema 
const Lounge= mongoose.model('Lounge', LoungeSchema);

// Export the Lounge model
module.exports = Lounge;