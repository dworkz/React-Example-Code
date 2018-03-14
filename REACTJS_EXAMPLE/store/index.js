import { createStore, combineReducers, applyMiddleware } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'

import { reducer as formReducer } from 'redux-form'
import { homeReducer } from './reducers/home-reducer'

const logger = createLogger({
  collapsed: true
})

const rootReducer = combineReducers({
  homeReducer
})

const store = createStore(rootReducer, applyMiddleware(thunk, logger))

window.store = store // to get access from browser

store.subscribe(() => {
  console.log('store has been changed!')
})

export default store
