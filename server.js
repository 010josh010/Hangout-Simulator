'use strict'; 

const express = require('express'); 
const bodyParser = require('body-parser'); 
const path = require('path'); 
const mongoose = require('mongoose');  
const methodOverride = require('method-override');
const helmet = require('helmet'); 
const Shared = require('./services/Shared');
const expressJWT = require('express-jwt'); 


//express init 
const app = express();

//environment variable port for deployment
const PORT = process.env.PORT;

//for Socket io
const server = require('http').Server(app); 
const io = require('socket.io')(server)

let users =[] ; 
let connections = []; 

io.sockets.on('connection' , socket=>{
	connections.push(socket); 
	console.log(connections.length , 'sockets connected'); 

	//on disconnect 
	socket.on('disconnect' , data=>{
		connections.splice(connections.indexOf(socket) , 1); 
		console.log(connections.length , 'sockets connected'); 
	})

	//Send Message 
	socket.on('send message' , data=>{
		io.sockets.emit('new message' , data); 
	})
})


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

 //for jwt 
 app.use(expressJWT({secret: Shared.secret}).unless({path: ['/api/account/auth', '/api/account/signup']}))

/*end middleare--------------------*/ 

//listen on port or 3001 
server.listen(PORT || 3001 , _=>{console.log('listening on 3001')})

