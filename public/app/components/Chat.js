import React, { Component } from 'react'
import axios from 'axios' 
import { browserHistory} from 'react-router'

//child components 
import Star from './Star'


class Chat extends Component {
	constructor(props){
		super(props); 

		this.handleSubmit = this.handleSubmit.bind(this); 

		this.state ={
			name:'ChatName'
		}
	}


	handleSubmit(event){
		event.preventDefault(); 
		let msg = event.target.elements[0].value;
		
		if(msg){
			console.log(msg); 
			this.textarea.value = '';  
		}


	}

	shouldComponentUpdate(nextProps , nextState){
		return true; 
	}

	render(){
		return(
			<div className = "container">
			<Star /> 
				<div className = "row"> 
					<div className = "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-10 col-xs-offset-1"> 
						<h1> {this.state.name} </h1> 
					</div> 
				</div> 
				<div className = "row"> 
					<div className = "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-10 col-xs-offset-1"> 
						<div className = "chat-body"> 
						</div>
					</div> 
				</div> 

				<div className = "row"> 
					<div className="col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12"> 
						<form onSubmit={this.handleSubmit}> 
							<div className="chat-input"> 
								<textarea ref={(ref)=> this.textarea = ref} rows="2" cols="50"/> 
								<button type="submit" className="btn-submit">Send</button>
							</div> 
						</form> 
					</div> 
				</div> 
			</div> 
		)
	}
}


export default Chat 