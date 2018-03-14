import { HomeAction, AuthActions } from '../actions'
import moment from 'moment'

const initialState = {
  usersLocations: [],
  currentLocation: null,
  chartData: null,
  isLoading: false,
  isLoaded: false,
  locationUnits: [],
  chartFilterStartDate: moment(),
  chartRangeDate: {
    startDate: moment().subtract(1, 'week').startOf('week').day('friday'),
    endDate: moment()
  }
}

export const homeReducer = (state = initialState, action) => {
  switch (action.type) {
    case HomeAction.SET_CHART_DATA:
      return Object.assign({}, state, {
        chartData: action.data
      })
    case AuthActions.LOGOUT:
      return Object.assign({}, state, {
        chartData: null,
        usersLocations: [],
        currentLocation: null
      })
    case HomeAction.SET_USER_LOCATION:
      return Object.assign({}, state, {
        currentLocation: action.location
      })
    case HomeAction.GET_USERS_LOCATIONS:
      return Object.assign({}, state, {
        usersLocations: action.data
      })
    case HomeAction.CHANGE_START_DATE:
      return Object.assign({}, state, {
        chartRangeDate: {
          startDate: action.date,
          endDate: state.chartRangeDate.endDate
        }
      })
    case HomeAction.CHANGE_END_DATE:
      return Object.assign({}, state, {
        chartRangeDate: {
          startDate: state.chartRangeDate.startDate,
          endDate: action.date
        }
      })
    case HomeAction.IS_LOADING:
      return Object.assign({}, state, {
        isLoaded: false,
        isLoading: true
      })
    case HomeAction.IS_LOADED:
      return Object.assign({}, state, {
        isLoading: false,
        isLoaded: true
      })
    case HomeAction.SET_LOCATION_UNITS: {
      return Object.assign({}, state, {
        locationUnits: action.data
      })
    }
    default:
      return state
  }
}
