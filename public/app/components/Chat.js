import React, { Component } from 'react'
import axios from 'axios' 
import { browserHistory} from 'react-router'
import moment from 'moment' 


//child components 
import Star from './children/Star'


class Chat extends Component {
	constructor(props){
		super(props); 

		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleKeyUp = this.handleKeyUp.bind(this);
		this.handleNewMessage = this.handleNewMessage.bind(this);
		this.handleIsTyping = this.handleIsTyping.bind(this);
	

		this.state ={
			name:'Test', 

			socket: ()=>{}, 

			user: '', 

			joined: [], 

			isTyping: false, 

			isTypingMsg: '', 

			messages: [{_id:1 , user:'LoungeBot'  , msg: 'Welcome to Test', time: moment.utc().format('MMMM Do YYYY, h:mm:ss a')}],

			utcOffset: moment().utcOffset()

		}
	}


	handleSubmit(event){
		event.preventDefault();
		
		let data = {
			user:this.state.user, 

			msg: this.chatInput.value, 

			time: moment.utc().format('MMMM Do YYYY, h:mm:ss a')
		}
		//if there is text in the input then send 
		if(this.chatInput.value){
			this.state.socket.emit('send message', data); 
			//clear out the textarea 
			this.chatInput.value = '';  

			//emit not typing because the data was sent 
			this.setState({isTyping:false} , _=>{
				this.state.socket.emit('not typing' , {user:data.user})

			})

			//save message to the db
			//this.saveMessageToDB(data);
		} 
	}

	handleKeyUp(event){
		//if the key is enter then submit the form
		if(event.key === 'Enter'){
			this.handleSubmit(event); 
		}

		//for passing to the typing event 
		let data = {
			user:this.state.user
		}

		//for handling typing triggers 
		if(this.chatInput.value && this.state.isTyping === false){

			this.setState({isTyping:true} , _=>{
				this.state.socket.emit('typing' ,data)
				
			})
		//if the chat input is empty then emit not typing 
		} else if(!this.chatInput.value){

			//set the state of typing back to false
			this.setState({isTyping:false},  _=>{
				this.state.socket.emit('not typing' , data)
			})
			
		}
	}

	handleIsTyping(data){
		let user = data.user; 

		//set the is typing message to this 
		if(this.state.user !== user){
				this.setState({isTypingMsg: `${user} is typing a message`}, _=>{
					//set the class to fadeTo to trigger the animation
					this.isTypingP.className = 'fadeTo'
				}); 
		}
	}

	handleIsNotTyping(data){
		let user = data.user;


		if(this.state.user !== user){
			//set the state of the isTypingmsg to a blank string 
			this.setState({isTypingMsg:''} , _=>{

				//remove all the classes from the element
				this.isTypingP.className = ''
			}); 
		}
	}

	handleNewMessage(data){

		//parsing the time based on the utcOffset
		data.time = moment(data.time._d).
						utcOffset(this.state.utcOffset).
							format('MMMM Do YYYY, h:mm:ss a');

		//adding the new message and concatenating to the array					
		this.setState({
			messages:this.state.messages.concat([data])
		});

		//scroll to the bottom of the page for the new message 
		this.chatBody.scrollTop = this.chatBody.scrollHeight;

	}

	saveMessageToDB(data){

		//get the logged in user's information 
		const headers = {
			'Authorization': 'Bearer '+ localStorage.getItem('hsjwt')
		}
		console.log('messaged saved')
	}


	componentWillMount(){
		//get the lounge name and messages from the database



		//get the logged in user's information 
		const headers = {
			'Authorization': 'Bearer '+ localStorage.getItem('hsjwt')
		}

		axios.get('/api/account/info', {headers:headers})
				.then(res=>{
					let username = res.data.userName; 
					this.setState({user:username}); 
				})
	}

	componentDidMount(){

		this.setState({socket:io.connect()} , _=>{
			//new message event
			this.state.socket.on('new message', data=>{
				this.handleNewMessage(data); 
			})

			//isTyping event
			this.state.socket.on('is typing' , data=>{
				this.handleIsTyping(data); 
			})

			this.state.socket.on('is not typing' , data=>{
				this.handleIsNotTyping(data); 
			})


		});


		//scroll to the end of the messages
		this.chatBody.scrollTop = this.chatBody.scrollHeight;
		

	}

	shouldComponentUpdate(nextprops , nextState){
  		return true;
  	}

	render(){
		return(
			<div className = "container">
			<Star /> 
				<div className = "row"> 
					<div className = "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12"> 
						<h1> {this.state.name} </h1> 
					</div> 
				</div> 
				<div className = "row"> 
					<div className = "col-lg-8 col-lg-offset-2 col-md-8 col-md-offset-2 col-xs-12"> 
						<div ref={(ref)=>this.chatBody = ref} className = "chat-body"> 
							{this.state.messages.map(data=>{ 
								return(
									<div key={data._id} className="message-container fadeTo">
										<strong>{data.user}</strong><time>{data.time}</time> 
										<br /> 
										<blockquote>
											<p className="message ">{data.msg}</p>
										</blockquote>
									</div> 
								)
							})}
							
						</div>
						<div className="isTyping"> <p ref={(ref)=>{this.isTypingP = ref}}> {this.state.isTypingMsg} </p> </div> 
					</div> 
				</div> 

				<div className = "row"> 
					<div className="col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12"> 
						<form ref={(ref)=> this.chatForm = ref} onSubmit={this.handleSubmit}> 
							<div className="chat-input"> 
								<textarea onKeyUp={this.handleKeyUp} ref={(ref)=> this.chatInput = ref} rows="2" cols="50"/> 
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