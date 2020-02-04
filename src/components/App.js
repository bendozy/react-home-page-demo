import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import NotFound from '../pages/NotFound';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import PrivateRoute from '../hocs/PrivateRoute';
import PublicRoute from '../hocs/PublicRoute';
import NonAuthRoute from '../hocs/NonAuthRoute';
import store from '../store';

const App = () => (
  <Provider store={store}>
    <Router>
      <Switch>
        <PublicRoute exact path="/" component={Home} />
        <NonAuthRoute exact path="/login" component={Login} />
        <NonAuthRoute exact path="/register" component={Register} />
        <PrivateRoute exact path="/profile" component={Profile} />
        <PrivateRoute exact path="/profile-edit" component={EditProfile} />
        <PublicRoute component={NotFound} />
      </Switch>
    </Router>
  </Provider>
);

export default App;
