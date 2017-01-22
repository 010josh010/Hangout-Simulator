'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('mongoose');  
const methodOverride = require('method-override');
const helmet = require('helmet'); 
const expressJWT = require('express-jwt'); 
const Shared = require('./services/Shared'); 


//express init and port 
const app = express(); 
//process.env.PORT
const PORT = 3001; 


/*middleware---------------------*/  
//for body parser 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended:true})); 
app.use(bodyParser.text()); 
app.use(bodyParser.json({type:'application/vnd.api+json'})); 

//method override 
app.use(methodOverride('_method'));


//for express security 
app.use(helmet()); 

//for serving static content 
app.use(express.static(path.join(__dirname, 'public')));

//export routes from router 
const mainController = require('./controllers/mainController.js'); 
app.use('/' , mainController); 

//for express jwt 
app.use(expressJWT({secret: Shared.secret}).unless({path: ['/', '/account/auth']}))

/*end middleare--------------------*/ 


//listening for connections 
app.listen( PORT, _=> console.log('listening on port' , PORT)); 
