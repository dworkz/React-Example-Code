import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { HomeAction } from '../store/actions'
import Header from './home-header'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import HomeTable from '../components/home-table'
import HomeActions from '../components/home-actions'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

class CustomXAxisTick extends Component {
  render() {
    const { x, y, payload } = this.props
    return (
      <g transform={`translate(${x},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="end" fill="#666" style={{ fontSize: '12px' }} transform="rotate(-25)">
          {payload.value}
        </text>
      </g>
    )
  }
}

class Home extends Component {
  constructor() {
    super()
    this.state = {
      chartsWidth: null
    }
    this.renderChartLines = this.renderChartLines.bind(this)
    this.renderHomeView = this.renderHomeView.bind(this)
  }

  componentWillMount() {
    // load data
    if (this.props.isAuthenticated) {
      this.props.fetchUserLocations()
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.currentLocation !== nextProps.currentLocation) {
      nextProps.fetchChartData()
      nextProps.fetchLocationUnits()
    }
  }

  renderChartLines = (key, index) => {
    const color = '#' + Math.random().toString(16).substr(-6)
    return <Line key={index} type="basis" dataKey={key} strokeWidth={1.95} dot={{ strokeWidth: 1.2 }} stroke={color} />
  }

  // width
  setMainContent = elem => {
    if (elem && this.state.chartsWidth !== elem.clientWidth) {
      this.setState({
        chartsWidth: elem.clientWidth
      })
    }
  }

  renderHomeView = () => {
    const { chartsWidth } = this.state
    const { chartData, chartFilterStartDate, currentLocation, userLocations } = this.props
    let lineKeys = chartData.length && Object.keys(chartData[0]).filter(key => key !== 'date')
    const { translate } = this.props

    return (
      <div className="main-content" ref={div => this.setMainContent(div)}>
        <Header
          chartFilterStartDate={chartFilterStartDate}
          changeUserLocation={this.props.changeUserLocation}
          chartFilterDateChange={this.props.chartFilterDateChange}
          currentLocation={currentLocation}
          userLocations={userLocations}
          translate={translate}
        />

        {lineKeys.length
          ? <div className="Line">
              {this.props.isLoaded
                ? <LineChart
                    width={chartsWidth}
                    height={270}
                    data={chartData}
                    strokeWidth={1}
                    margin={{ top: 15, right: 30, left: 20, bottom: 15 }}
                  >
                    <XAxis dataKey="date" tick={<CustomXAxisTick />} />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Legend wrapperStyle={{ bottom: '-50px' }} />
                    {lineKeys.map(this.renderChartLines)}
                  </LineChart>
                : this.loader()}
            </div>
          : <div>
              <h3 style={{ textAlign: 'center' }}>
                {this.props.translate.noChartsData}
              </h3>
            </div>}

        <div className="columns" style={{ padding: '25px 0' }}>
          <div className="column is-two-thirds">
            <HomeTable data={this.props.locationUnits} />
          </div>
          <div className="column">
            <HomeActions />
          </div>
        </div>

      </div>
    )
  }

  loader = () => (
    <div className="spinner">
      <div className="bounce1" />
      <div className="bounce2" />
      <div className="bounce3" />
    </div>
  )

  renderError = userLocations =>
    userLocations.message &&
    <ReactCSSTransitionGroup
      transitionName="anim"
      transitionAppear
      transitionAppearTimeout={300}
      transitionEnter={false}
      transitionLeave={false}
    >
      <div className="showError">
        <span>
          {userLocations.message}
        </span>
      </div>
    </ReactCSSTransitionGroup>

  render() {
    const { chartData, currentLocation, userLocations } = this.props

    if (chartData) {
      return (
        <ReactCSSTransitionGroup
          transitionName="anim"
          transitionAppear
          transitionAppearTimeout={300}
          transitionEnter={false}
          transitionLeave={false}
        >
          {this.renderHomeView()}
        </ReactCSSTransitionGroup>
      )
    }
    if (!currentLocation) {
      return (
        <div className="main-content">
          {this.renderError(userLocations)}
        </div>
      )
    } else {
      return (
        <div className="main-content">
          {this.loader()}
        </div>
      )
    }
  }
}

const mapStateToProps = state => {
  return {
    chartFilterStartDate: state.homeReducer.chartFilterStartDate,
    chartData: state.homeReducer.chartData,
    isLoaded: state.homeReducer.isLoaded,
    userLocations: state.homeReducer.usersLocations,
    locationUnits: state.homeReducer.locationUnits,
    currentLocation: state.homeReducer.currentLocation,
    isAuthenticated: state.authReducer.isAuthenticated,
    translate: state.langReducer.allLang[state.langReducer.currentLang]
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchChartData: bindActionCreators(HomeAction.fetchChartData, dispatch),
    fetchUserLocations: bindActionCreators(HomeAction.fetchUserLocations, dispatch),
    changeUserLocation: bindActionCreators(HomeAction.setUserLocation, dispatch),
    chartFilterDateChange: bindActionCreators(HomeAction.chartFilterDateChange, dispatch),
    fetchLocationUnits: bindActionCreators(HomeAction.fetchLocationUnits, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)
