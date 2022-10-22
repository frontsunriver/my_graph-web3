import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import reducers from './reducers/index';
import createSagaMiddleware from 'redux-saga';

import { spawn } from 'redux-saga/effects';
import modals from '../sagas/modals';

const rootSagas = function* rootSaga() {
    yield spawn(modals);
  }

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  combineReducers({
    ...reducers,
  }),
  composeEnhancers(
    applyMiddleware(sagaMiddleware),
  )
);

sagaMiddleware.run(rootSagas);

export { store };