import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import './index.css';
import App from './App';
import account from './Account/AccountReducer.js';
import footprint from './Footprint/FootprintReducer.js';
import registerServiceWorker from './registerServiceWorker';

const history = createHistory();

const rootReducer = combineReducers({
  account,
  footprint,
  routerReducer
});

const store = createStore(
  rootReducer,
  {
    account: {
      requestingPlaidToken: false,
      plaidAccessToken: null,
      plaidItemId: null
    },
    footprint: {
      footprintData: null
    }
  },
  applyMiddleware(
    logger,
    thunkMiddleware,
    routerMiddleware(history)
  )
);

export class AppProvider extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
            <Route component={App} />
        </ConnectedRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<AppProvider />, document.getElementById('root'));
registerServiceWorker();
