import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistGate } from 'redux-persist/integration/react'
import logger from 'redux-logger';
import createHistory from 'history/createBrowserHistory';
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux';
import './index.css';
import App from './App';
import account from './Account/AccountReducer.js';
import footprint from './Footprint/FootprintReducer.js';
import registerServiceWorker from './registerServiceWorker';

const persistConfig = {
  key: 'root',
  storage
};

const history = createHistory();

const rootReducer = combineReducers({
  account,
  footprint,
  routerReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  {
    account: {
      requestingPlaidToken: false,
      plaidAccessToken: null,
      plaidItemId: null
    },
    footprint: {
      loadingFootprint: false,
      footprintData: null
    }
  },
  applyMiddleware(
    logger,
    thunkMiddleware,
    routerMiddleware(history)
  )
);

const persistor = persistStore(store);

export class AppProvider extends Component {
  constructor() {
    super();
    this.state = { rehydrated: false }
  }

  componentWillMount() {
    persistStore(store, {}, () => {
      this.setState({ rehydrated: true });
    });
  }

  render() {
      return (
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Route component={App} />
            </ConnectedRouter>
          </PersistGate>
        </Provider>
      );
  }
}

ReactDOM.render(<AppProvider />, document.getElementById('root'));
registerServiceWorker();
