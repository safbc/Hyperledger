import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

import settings from './settings'

export default combineReducers({
  settings,
  routing: routerReducer
})
