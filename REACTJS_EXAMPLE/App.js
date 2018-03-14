import React, {Component} from 'react'
import {Provider} from 'react-redux'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import PrivateRoute from './containers/private-route'
import store from './store/index'

import './App.css'

// Components
import Home from './containers/home'
import LoginForm from './containers/login-form'
import SignUpForm from './containers/signup-form'
import Settings from './containers/settings'

class App extends Component {
  render() {
    return (
      <Router>
        <Provider store={store}>
          <div className="App">
            <Switch>
              <PrivateRoute exact path="/" component={Home}/>
              <PrivateRoute path="/settings" component={Settings}/>
              <Route path="/auth/login" component={LoginForm}/>
              <Route path="/auth/signup" component={SignUpForm}/>
              <Route component={() => <div>404</div>}/>
            </Switch>
          </div>
        </Provider>
      </Router>
    )
  }
}

export default App
