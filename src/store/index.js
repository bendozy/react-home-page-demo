import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import { getCurrentUser } from '../actions/auth';

const middlewares = [thunk];

if (process.env.NODE_ENV === `development`) {
  // eslint-disable-next-line global-require
  const { logger } = require(`redux-logger`);

  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

store.dispatch(getCurrentUser());

export default store;
