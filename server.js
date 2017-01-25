'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('mongoose');  
const methodOverride = require('method-override');
const helmet = require('helmet'); 

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

//export route controllers from router 
const mainController = require('./controllers/mainController'); 
app.use('/api' , mainController); 


//for express unauthorized user redirect to the login page
 app.use(function(err, req, res, next) {
    if(401 == err.status) {
        res.redirect('/');
    }
  });

//for react router browser history to return path to the app 
 app.get('*', function (req, res){
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

/*end middleare--------------------*/ 


//listening for connections 
app.listen( PORT, _=> console.log('listening on port' , PORT)); 
