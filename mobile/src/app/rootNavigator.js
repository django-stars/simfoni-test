import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { TabNavigator, addNavigationHelpers, NavigationActions } from 'react-navigation'
import { createReduxBoundAddListener, createReactNavigationReduxMiddleware } from 'react-navigation-redux-helpers'
import { Platform, AppState } from 'react-native'

import UploadFile from './uploadfile'
import Groups from './groups'
import Chart from './chart'
import WelcomeLoading from './WelcomeLoading'

import get from 'lodash/get'

const tabBarOptions = {
  activeTintColor: styles.COLOR_PRIMARY,
  inactiveTintColor: '#888888',
  upperCaseLabel: false,
  showIcon: true,
  indicatorStyle: {
    backgroundColor: 'transparent'
  },
  style: {
    height: 56,
    backgroundColor: '#f5f5f5'
  },
  tabStyle: {
    backgroundColor: 'transparent'
  },
  labelStyle: {
    margin: 0,
    fontSize: styles.FONT_SIZE_SMALL,
    lineHeight: parseInt(styles.FONT_SIZE_SMALL * 1.14, 10)
  }
}

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: true,
  animationEnabled: true,
  initialRouteName: 'UploadFile',
  order: ['UploadFile', 'Groups', 'Chart'],
  tabBarOptions
}

const appRoutes = {
  UploadFile: { screen: UploadFile },
  Groups: { screen: Groups },
  Chart: { screen: Chart }
}

const AppNavigator = TabNavigator(appRoutes, options)
const router = AppNavigator.router

const navigationMiddleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)
const addListener = createReduxBoundAddListener('root')

class AppWithNavigationState extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    if (!this.props.persisted) {
      return <WelcomeLoading />
    }
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav,
          addListener
        })}
      />
    )
  }
}

export default connect(({ nav, persisted }) => ({ nav, persisted }))(AppWithNavigationState)

export { router, navigationMiddleware }
