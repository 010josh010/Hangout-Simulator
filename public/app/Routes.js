import React, { Component } from 'react'
import { Router, Route, Link, IndexRoute, hashHistory, browserHistory } from 'react-router'

//components 
import Login from './components/Login'
import Lounges from './components/Lounges'


class Routes extends Component {
  render() {
    return (
      <Router history={browserHistory}>
        <Route path='/' component={Login} />
        <Route path='/lounges' component={Lounges} />
      </Router>
    )
  }
}

export default Routes