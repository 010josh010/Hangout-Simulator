import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

//components 
import Login from './components/Login'
import Lounges from './components/Lounges'
import Chat from './components/Chat'
import NotFound from './components/NotFound'
import Signup from './components/Signup'
import ThankYou from './components/ThankYou'


class Routes extends Component {
  render() {
    return (
      <Router history={ browserHistory }>
        <Route path="/" component={ Login } />
        <Route path="/lounges" component={ Lounges } />
        <Route path="/chat=:lounge" component={ Chat } /> 
        <Route path="/404" component={ NotFound } /> 
        <Route path="/signup" component={ Signup } /> 
        <Route path="/thankyou" component={ ThankYou } /> 

      </Router>
    )
  }
}

export default Routes