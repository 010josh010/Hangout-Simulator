'use strict'; 
//dependencies
const express = require('express'); 
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path'); 
const expressJWT = require('express-jwt'); 
const jwt = require('jsonwebtoken'); 

//required service modules
const Shared = require('../services/Shared');
const Salt = require('../services/Salt');  

//models 
const User = require('../models/User');
const Lounge = require('../models/Lounge'); 

/*Database configuration with mongoose begin----------*/
const localConn = 'mongodb://localhost/hangoutSim_db'; 
const MONGODB_URI = 'mongodb://heroku_hdxdk3f2:i81ine4tolat4q4t7094fvb8nc@ds053130.mlab.com:53130/heroku_hdxdk3f2';

mongoose.connect(MONGODB_URI);
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
//for user of json web tokens on routes
router.use(expressJWT({secret: Shared.secret}).unless({path: ['/api/account/auth', '/api/account/signup']}))

//for verifying token 
router.get('/verify',(req, res)=>{
	//for verification 
	const userId = req.user.userId;  

	User.findOne({_id: userId})
			.exec((err, user)=>{
				if(err){
					res.status(500).send(err); 
				} else if(!user){
					res.status(401).send('Unauthorized'); 
				} else {
					res.status(200).json('verified'); 
				}
			}); 


}); 

//returns all of the active lounges *must use app or route will be unprotected
router.get('/lounges' , (req, res)=>{

	//finds and displays all lounges as json 
	Lounge.find()
			.populate('members','userName')
				.exec((err, lounges)=>{
					if(err){
						res.status(500).send(err); 
					} else {
						res.status(200).json(lounges); 
					}
				})
})


//route for account signup 
router.post('/account/signup' , (req, res)=>{

	//creates the new user based on the schemea 
	const newUser = new User(req.body); 
	newUser.salt(newUser.password); 

	newUser.save((err, saved)=>{
		if(err){
			res.status(500).send(err); 
		} else {
			res.status(200).send(saved); 
		}
	})
})

//route for authentication and passing of jwt 
router.post('/account/auth' , (req, res)=>{

	//for verification 
	const username = req.body.userName; 
	const pwd = Salt(req.body.password); 

	User.findOne({userName: username})
		.exec((err, user)=>{
			if(err){
				res.send(err); 
			} else if(!user) {
				res.status(401).send('Unauthorized')
			} else if(!pwd){
				res.status(401).send('Unauthorized'); 
			} else if(pwd !== user.password){
				res.status(401).send('Unauthorized')
			} else {
				//exchage for a web token here 
				const jwtToken = jwt.sign({userId:user._id} , Shared.secret)
				res.status(200).json({token:jwtToken}); 
			}
		})

})

//route to manage a users account and update information 
router.get('/account/info/',(req, res)=>{
	//for verification 
	const userId = req.user.userId;  

	User.findOne({_id: userId})
			.exec((err, user)=>{
				if(err){
					res.status(500).send(err); 
				} else if(!user){
					res.status(404).send('page not found'); 
				} else {
					res.status(200).json(user); 
				}
			}); 

}); 

//route to manage a users account and update information 
router.put('/account/manage/',(req, res)=>{

	//for verification 
	const userId = req.user.userId;  

	User.findOne({_id: userId})
			.exec((err, user)=>{
				if(err){
					res.status(500).send(err); 
				} else if(!user){
					res.status(404).send('page not found'); 
				} else {
					res.status(200).json(user); 
				}
			}); 


}); 



//route to add a new Lounge
/*
router.post('/lounge/add' , (req, res)=>{ 

	//for verification 
	const userId= req.user.userId; 

	//creating a new lounge from out loungemodel with the req body 
	const newLounge = new Lounge(req.body); 
	//lookup the user making the request 
	User.findOne({_id: userId})
			.exec((err, user)=>{
				if(err){
					res.status(500).send(err)
					//if they are already joined to a lounge, they 
				} else if(!user){
					res.status(404).send('page not found'); 

				} else if(user.joinedTo){
					res.status(400).send('cannot create lounge'); 
				} else {
					//save the lounge to the db 
					newLounge.save((err, saved)=>{
						if(err){
							//sends errors to the client
							res.status(500).send(err); 
						} else {
							res.status(200).redirect('/lounge/join/'+saved._id); 
						}
					})
				}
			})

});

*/


/*
//route to join a lounge 
router.get('/lounge/join/?:loungeId', (req, res)=>{
	
	//for verification 
	const userId = req.user.userId; 
	const loungeId= req.params.loungeId;   

	//find the lounge based on the unique _id 
	Lounge.findOneAndUpdate({_id: loungeId} , {$push:{members:userId}} , {new:true})
			.exec((err, lounge)=>{
				if(err){
					res.status(500).send(err); 
				} else if(!lounge){
					res.status(404).send('page not found'); 
				} else {
					User.findOneAndUpdate({_id: userId} , {joinedTo:lounge._id}, {new:true})
						.exec((err, newdoc)=>{
							if(err){
								res.status(500).send(err); 
							}	else if(!newdoc){
								Lounge.findOneAndUpdate({_id: lounge._id} , {$pull:{members:userId}} , {new:true}) 
										.exec((err, updated)=>{
											if(err){
												res.status(500).send(err)
											} else {
												res.status(404).send('page not found'); 
											}

										})
							} else {
								res.status(200).json(newdoc); 
							}
						})
				}
			})

}) 

//route to remove a lounge
router.delete('/lounge/remove' , (req, res)=>{
	//assigns req body values for querying 
	const userId = req.user.userId; 
	const loungeId = req.body._id;
	//removes the lounge based on its unique id
	Lounge.remove({'_id':loungeId})
		.exec((err, removed)=>{
			if(err){
				res.send(err)
			} else {
				//removes lounge id reference from the Users's lounges array
				User.findOneAndUpdate({'_id':userRef}, {$pull: { 'lounges':loungeId }}, { new: true })
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

*/


//exports the module as router
module.exports = router ; 