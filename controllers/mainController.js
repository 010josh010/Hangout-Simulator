'use strict'; 
//dependencies
const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path'); 
const jwt = require('jsonwebtoken'); 

//required service modules
const Shared = require('../services/Shared');  

//models 
const User = require('../models/User');
const Lounge = require('../models/Lounge'); 

/*Database configuration with mongoose begin----------*/
const localConn = 'mongodb://localhost/hangoutSim_db'; 
mongoose.connect(localConn);
const db = mongoose.connection;

//configuring mongoose to use native promises due to mpromise deprecation
mongoose.promise = global.Promise; 

// Show any mongoose errors
db.on('error',(err)=>{
  console.log("Mongoose Error: ", err);
});

// Once logged in to the db through mongoose, log a success message
db.once('open',_=> {
  console.log('Mongoose connection successful.');
});
/*end configuration------------------------------------*/ 

/*routes-*/ 
//main route to render the index handlebars template
router.get('/' , (req, res)=>{
	res.status(200).sendFile(path.join(__dirname + 'index.html')); 
}); 

router.post('/account/signup' , (req, res)=>{
	const newUser = new User(req.body); 

	newUser.salt(newUser.password); 

	newUser.save((err, saved)=>{
		if(err){
			res.status(500).send(err); 
		} else {
			console.log('test of hash: '+ saved.password); 
			res.status(200).send(saved); 
		}
	})
})

router.post('/account/auth' , (req, res)=>{

	User.findOne({'username': req.body.username})
		.exec((err, user)=>{
			if(err){
				res.send(err); 
			} else if(!user) {
				res.status(401).send('username not found')
			} else if(req.body.password !== user.password){
				res.status(401).send('password required'); 
			} else {
				console.log('authentication successful'); 
				//exchage for a web token here 
				const token = jwt.sign({username:req.body.username} , Shared.secret)
				res.status(200).json(token); 
			}
		})

})

//route to return all users from the db
router.get('/users/all' , (req, res)=>{
	User.find()
			.sort({'userName':1})
				.populate('lounges')
					.exec((err, users)=>{
						if(err){
							res.send(err); 
						} else {
							res.json(users); 
						}
					}); 
}); 

//route to add a new Lounge
router.post('/lounge/add' , (req, res)=>{

	//creating a new lounge from out loungemodel with the req body 
	const newLounge = new Lounge(req.body); 

	newLounge.save((err, saved)=>{
		if(err){
			//sends errors to the client
			res.send(err); 
		} else {
			// Find our User and push the new lounge into the users lounges array
		      User.findOneAndUpdate({'_id':saved.userRef}, { $push: { 'lounges': saved._id } }, { new: true })
		      	.populate('lounges')
			      	.exec((err, newdoc)=> {
				        if (err) {
				          res.send(err);
				        }
				        // Or send the newdoc to the client
				        else {
				          res.send(newdoc);
				        }
			      })
		}
	})

}); 
//route to remove a lounge
router.delete('/lounge/remove' , (req, res)=>{
	//assigns req body values for querying 
	const userRef = req.body.userRef; 
	const loungeId = req.body._id;
	//removes the lounge based on its unique id
	Lounge.remove({'_id':loungeId})
		.exec((err, removed)=>{
			if(err){
				res.send(err)
			} else {
				//removes lounge id reference from the Users's lounges array
				User.findOneAndUpdate({'_id':userRef}, { $pull: { 'lounges':loungeId } }, { new: true })
		      		.populate('lounges')
				      	.exec((err, newdoc)=> {
					        if (err) {
					          res.send(err);
					        }
					        // Or send the newdoc to the client
					        else {
					          res.send(newdoc);
					        }
				      })
			}
		})


});
//exports the module as router
module.exports = router ; 