import { combineReducers } from 'redux'

import makers from './makers'
import resource from './resource'
import view from './view'

export default combineReducers({
    makers,
    resource,
    view
})
