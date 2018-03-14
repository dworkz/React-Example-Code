import moment from 'moment'
import axios from 'axios'
import { logOut } from './auth-actions'

export const SET_CHART_DATA = 'SET_CHART_DATA'
export const GET_USERS_LOCATIONS = 'GET_USERS_LOCATIONS'
export const CHANGE_CHART_FILTER_START_DATE = 'CHANGE_CHART_FILTER_START_DATE'
export const SET_USER_LOCATION = 'SET_USER_LOCATION'
export const CHANGE_START_DATE = 'CHANGE_START_DATE'
export const CHANGE_END_DATE = 'CHANGE_END_DATE'
export const ERROR = 'ERROR'
export const IS_LOADING = 'IS_LOADING'
export const IS_LOADED = 'IS_LOADED'
export const SET_LOCATION_UNITS = 'SET_LOCATION_UNITS'

const API_URL = process.env.REACT_APP_API_URL

export const setChartData = data => {
  return {
    type: SET_CHART_DATA,
    data
  }
}

export const isLoading = () => {
  return {
    type: IS_LOADING
  }
}

export const isLoaded = () => {
  return {
    type: IS_LOADED
  }
}

export const setUserLocation = location => {
  return {
    type: SET_USER_LOCATION,
    location
  }
}

export const chartFilterDateChange = date => {
  return {
    type: CHANGE_CHART_FILTER_START_DATE,
    date
  }
}

export const startDateChange = date => {
  return {
    type: CHANGE_START_DATE,
    date
  }
}

export const endDateChange = date => {
  return {
    type: CHANGE_END_DATE,
    date
  }
}

export const getUsersLocations = data => {
  return {
    type: GET_USERS_LOCATIONS,
    data
  }
}

export const Error = data => {
  return {
    type: ERROR,
    data
  }
}

export const setLocationUnits = data => {
  return {
    type: SET_LOCATION_UNITS,
    data
  }
}

export const fetchUserLocations = () => {
  return (dispatch, getState) => {
    const state = getState()
    let headers = state.authReducer.authData
    if (!state.authReducer.authData) headers = JSON.parse(localStorage.getItem('auth-data'))
    return axios({
      method: 'get',
      url: `${API_URL}/api/v1/locations/getUserLocations?locationType=store`,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'cache-control': 'no-cache'
      }
    })
      .then(payload => {
        const { data } = payload
        const currLocationId = !!data[0] && data[0]
        dispatch(getUsersLocations(data))
        dispatch(setUserLocation(currLocationId))
        if (data.status === 'error') {
          dispatch(Error(data.message))
          console.error(data.message)
        }
      })
      .catch(
        error =>
          error.response.status === 401
            ? dispatch(logOut()) && localStorage.removeItem('auth-data') && dispatch(Error(error))
            : dispatch(Error(error))
      )
  }
}

export const fetchChartData = () => {
  return (dispatch, getState) => {
    const state = getState()
    let locationId = state.homeReducer.currentLocation.id || 0
    let { startDate, endDate } = state.homeReducer.chartRangeDate
    let headers = state.authReducer.authData
    if (!state.authReducer.authData) headers = JSON.parse(localStorage.getItem('auth-data'))
    if (state.homeReducer.currentLocation) {
      dispatch(isLoading())
      return axios({
        method: 'get',
        url: `${API_URL}/api/v1/locations/getInventoriesData?locationId=${locationId}&start_date=${startDate}&end_date=${endDate}`,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'cache-control': 'no-cache'
        }
      })
        .then(payload => {
          const { data } = payload
          const charts = data.map(i => {
            let dataItem = {
              date: moment(i.timestamp).format('YYYY-MM-DD, H:mm')
            }
            i.inventories.forEach(it => {
              dataItem[it.name] = it.balance
            })
            return dataItem
          })
          dispatch(setChartData(charts))
          dispatch(isLoaded())
        })
        .catch(err => dispatch(Error(err)))
    } else return null
  }
}

export const fetchLocationUnits = () => {
  return (dispatch, getState) => {
    const state = getState()
    const { id } = state.homeReducer.currentLocation
    console.log('curr id', id)
    console.log('ID', state.homeReducer.currentLocation)
    let headers = state.authReducer.authData
    if (!state.authReducer.authData) headers = JSON.parse(localStorage.getItem('auth-data'))
    return (
      state.homeReducer.currentLocation !== null &&
      axios({
        method: 'get',
        url: `${API_URL}/api/v1/locations/getLocationUnits?locationId=${id}`,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'cache-control': 'no-cache'
        }
      })
        .then(payload => {
          const { data } = payload
          dispatch(setLocationUnits(data))
          console.log('fetchLocationUnits', data)
        })
        .catch(error => dispatch(Error(error)) && console.error(error))
    )
  }
}
