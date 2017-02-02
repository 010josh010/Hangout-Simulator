import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

//components 
import Login from './components/Login'
import Lounges from './components/Lounges'
import Chat from './components/Chat'


class Routes extends Component {
  render() {
    return (
      <Router history={ browserHistory }>
        <Route path="/" component={ Login } />
        <Route path="/lounges" component={ Lounges } />
        <Route path="/chat" component={ Chat } /> 
      </Router>
    )
  }
}

export default Routes