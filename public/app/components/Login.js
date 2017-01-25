import React, { Component } from 'react'
import axios from 'axios'; 


//children 
import Banner from './Banner'
import Star from './Star'

class Login extends Component{

	constructor(props) {
	    super(props);

	    this.state = { 

	      sendAuthRequest:function(){

	      	let username = document.getElementById('username').value.trim(); 
	      	let password = document.getElementById('password').value.trim(); 

	      	if(username && password){
		      	axios.post('/api/account/auth' , {
		      		userName:username, 
		      		password:password 
		      	}).then(res=>{
	      			if(res.status === 200){
						console.log(res.data); 

						localStorage.setItem('hsjwt', res.data.token);
						console.log(localStorage.getItem('hsjwt'));
						window.location = '/lounges';
					} else {
						console.log('username or password is invalid'); 
					}

		      	}).catch(err=>{console.error(err)}); 
		     
		      }
	  		}, 

	  	
	    };

    }

	componentDidMount(){
  			axios({
  				method:'get', 
  				url:'/api/verify', 
  				headers:{
  					'Authorization':'Bearer '+localStorage.getItem('hsjwt')
  				}
  			}).then(res=>{
  				if(res.data === 'verified'){
  					window.location = '/lounges'; 
  				}else{
  					console.log('verify false')
  				}
  			})
  	}

	render(){
		return(
			<div className= 'container'>
				<Star />
				<Banner />
				<h1> Login </h1> 
				<div>
					<form className="login">
	          		
			          <div className="form-group">
			              <label htmlFor="userName"> Username</label>
			              <input id="username" type="text" className="form-control"  aria-describedby="Username" placeholder="Enter username" required>
			              </input> 
			            </div>
	            
		              <div className="form-group">
		                  <label htmlFor="password">Password</label>
		                  <input id="password" type="password" className="form-control" placeholder="Password" required>
		                  </input> 
		                </div>  
		           
		                <button onClick={this.state.sendAuthRequest} className="btn btn-submit">Submit</button>
		                <a href="/account/signup"><p>Don't have an account? Click here to sign up!</p></a>
		     		</form>
		     	</div>
			</div> 

		)
	}
}

export default Login 