import React, { Component } from 'react'
import axios from 'axios' 

//music for the lounge 
const music = new Audio('../../assets/audio/yanSimBed.mp3'); 

//children 
import Star from './Star'

class Lounges extends Component{

	constructor(props) {
	    super(props);

	    this.state = { 
	      user: '', 

	      lounges: [] , 

	      startPlayingMusic:function(){
	      		music.loop = true; 
	      		music.play();
	      }, 

	      stopPlayingMusic:function(){
	      		music.pause(); 
	      }, 

	      loggingOut:function(){
	      	localStorage.removeItem('hsjwt'); 
	      	window.location = '/'; 
	      }
	    };
  }


	componentDidMount(){

		this.state.startPlayingMusic(); 
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

				.catch(err=>{console.error(err)}); 
	}

	render(){
		return(
		<div className="container"> 
			<Star /> 
			<nav className="navigation">
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
					<button className="btn btn-controls" onClick ={this.state.stopPlayingMusic}>
					<i className="icon fa fa-pause fa-lg"> </i>
						 stop playing
					</button> 
					<button className="btn btn-controls" onClick = {this.state.startPlayingMusic}>
						<i className="icon fa fa-play fa-lg"></i>
							start playing 
					</button> 
				</div> 
			</nav>	

			<ul className="lounges">
				<div>
					{this.state.lounges.map(lounge=>{
						return (
							<div key={lounge._id}>
								<li className="well lounge"> <h4>{lounge.name }</h4></li> 
							</div> 
						)
					})}
				</div>
			</ul>

		</div> 
			
		)
	}
}

export default Lounges