import React, { Component } from 'react'
import axios from 'axios' 
import { browserHistory} from 'react-router'


//music for the lounge 
const loungeMusic = new Audio('../../assets/audio/yanSimBed.mp3'); 

//children 
import Star from './children/Star'

class Lounges extends Component{

	constructor(props) {
	    super(props);

	   	this.startPlayingMusic = this.startPlayingMusic.bind(this); 

		this.stopPlayingMusic = this.stopPlayingMusic.bind(this); 

	    this.state = { 

	      user:'', 

	      music:loungeMusic, 

	      lounges:[], 

	      playingMusic:false , 

		  loggingOut:function(){
	      	localStorage.removeItem('hsjwt'); 
	      	//rediredct to the login page
			browserHistory.push('/');
			}
	    
	    }

  }

  	startPlayingMusic(){
  		this.state.music.play();
  		this.state.playingMusic = true; 
	}

	stopPlayingMusic(){
		this.state.music.pause(); 
		this.state.playingMusic = false; 
	}

	loopMusic(){
		this.state.music.loop = true;  
	}

	joinLounge(){
		browserHistory.push('/chat=test');
	}


	componentWillMount(){ 

		const headers = {
			'Authorization': 'Bearer '+ localStorage.getItem('hsjwt')
		}
		axios.get('/api/lounges' , {headers:headers})
				.then(res=>{
					const lounges = res.data; 
					this.setState({lounges});
					return axios.get('/api/account/info', {headers:headers}); 
				}).then(res=>{
					let username = res.data.userName
					this.setState({user:username})
				})

				.catch(err=>{
					console.error(err)
					browserHistory.push('/'); 
				}); 
	}

	componentDidMount(){
		this.loopMusic();

	}


	componentWillUnmount(){
		this.stopPlayingMusic();
	}

	render(){
		return(
		<div className="container"> 
			<div className= "row"> 
				<div className="col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
					<Star /> 
					<h1> Lounges </h1> 
					<div className="userInfo">
						<div className="dropdown">
						  <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
						    Logged in as {this.state.user}
						    <span className="caret"></span>
						  </button>
						  <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
						    <li>
								<a><div className="btn-logout">
									<div onClick ={this.state.loggingOut}>

										<i className="icon fa fa-gear fa-lg"></i> 
										Log out 
									</div> 
								</div></a>
						    </li>
						    <li><a href="#">Manage Account</a></li>
						  </ul>
						</div>
					</div>
					<div className= "controls">
						<button className="btn btn-controls" onClick ={this.stopPlayingMusic}>
						<i className="icon fa fa-pause fa-lg"> </i>
							 stop playing
						</button> 
						<button className="btn btn-controls" onClick = {this.startPlayingMusic}>
							<i className="icon fa fa-play fa-lg"></i>
								start playing 
						</button> 
					</div> 
				</div> 

				<div className="admin-message"> <h4>Welcome to Hangout Simulator Alpha! As of now , the only lounge available is test. Thank you.  </h4> </div> 
			</div> 


			<div className="row"> 
				<div className = "col-lg-6 col-lg-offset-3 col-md-7 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12"> 
					<ul className="lounges">
						<div>
							{this.state.lounges.map(lounge=>{
								return (
									<div onClick={this.joinLounge} key={lounge._id}>
										<li className="well lounge"> <h4>{lounge.name }</h4></li> 
									</div> 
								)
							})}
						</div>
					</ul>
				</div> 
			</div> 
		</div> 
			
		)
	}
}

export default Lounges