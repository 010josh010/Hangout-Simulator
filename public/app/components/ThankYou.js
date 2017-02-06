import React, {Component} from 'react'
import { browserHistory } from 'react-router'


//children 
import Star from './children/Star'

class ThankYou extends Component{

	componentDidMount(){
		setTimeout(function(){
			browserHistory.push('/')
		} , 3000)
	}

	render(){
		return(
			<div className="container"> 
				<div className="row"> 
					<div className="col-lg-4 col-lg-offset-4 col-md-4 col-md-offset-4 col-xs-8 col-xs-offset-2">
						<Star /> 
						<h1>Account Created Successfully</h1> 
						<h3 className="admin-message">Thank you for using Hangout Simulator You will now be redirected to Login </h3> 
					</div> 
				</div> 
			</div> 
		)
	}
}


export default ThankYou 