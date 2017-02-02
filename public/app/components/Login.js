import React, { Component } from 'react'
import axios from 'axios'; 
import { browserHistory } from 'react-router'

//children 
import Banner from './Banner'
import Star from './Star'

class Login extends Component{

	constructor(props) {
	    super(props);
	    //binding this component to the handle methods 
	    this.handleSubmit = this.handleSubmit.bind(this); 
	    this.handleError = this.handleError.bind(this); 

	    this.state = { 
	    	error: ''		
	    }
    }

    handleError(error){
    	console.error(error);
    	this.errorBox.className += 'alert alert-danger'; 
    }

    handleSubmit(event){
    	event.preventDefault(); 
		const username = event.target.elements[0].value
    	const password = event.target.elements[1].value

   		if(username && password.length >=8){
		      	axios.post('/api/account/auth' , {
		      		userName:username, 
		      		password:password 
		      	}).then(res=>{
	      			if(res.status === 200){
						localStorage.setItem('hsjwt', res.data.token);
						browserHistory.push('/lounges');
					} 

		      	}).catch(err=>{
		      		console.error(err)
		      		this.setState({error:'*invalid username or password'} , _=>{
							this.handleError(this.state.error);
						})
		      	
		      	}); 
		     
		} else {

			this.setState({error:'*invalid username or password'} , _=>{
				this.handleError(this.state.error);
			})
		
		}
    }

	componentWillMount(){
  			axios({
  				method:'get', 
  				url:'/api/verify', 
  				headers:{
  					'Authorization':'Bearer '+localStorage.getItem('hsjwt')
  				}
  			}).then(res=>{
  				if(res.data === 'verified'){
  					browserHistory.push('/lounges');
  				}
  			})
  	}

  	shouldComponentUpdate(nextprops , nextState){
  		return true;
  	}

	render(){
		return(
			<div className= "container">
				<div className="row">
					<div className="col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-6 col-sm-offset-3 col-xs-12"> 
						<Star />
						<Banner />
						<h1> Login </h1>
						<div ref={(ref)=>{this.errorBox = ref}}>{this.state.error}</div>
					</div>
				</div> 
				
				<div className ="row"> 
					<div className="col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
						<form onSubmit={this.handleSubmit} className="login">
				          <div className="form-group">
				          	<br/>					           
				              <input id="username" type="text" className="form-control"  aria-describedby="Username" placeholder="Enter username" required>
				              </input> 
				          </div>
		       
			              <div className="form-group">
			              	<br/>
			                  <input id="password" type="password" className="form-control" placeholder="Password" required>
			                  </input> 
			              </div>  
			           
			                <button type="submit" className="btn-submit">Submit</button>
			                <a href="/account/signup">Don't have an account? Click here to sign up!</a>
					    </form>
					</div> 
				</div> 	
			</div> 

		)
	}
}

export default Login 