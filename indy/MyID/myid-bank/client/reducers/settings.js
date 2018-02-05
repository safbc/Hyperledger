import merge from 'lodash/merge'
import { CHANGE_LOADING } from '../actions/settings'

export default (state = {}, action) => {
  switch (action.type) {
    case CHANGE_LOADING:
      return merge({}, state, {loading: action.data})
    default:
      return state
  }
}
