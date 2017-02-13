import React from 'react'
import {
  Navigator
} from 'react-native'
import routes from './routes'

export default class App extends React.Component {
  render() {
    return <Navigator
      initialRoute={routes[0]}
      renderScene={this.renderScene}
    />
  }

  renderScene(route, navigator) {
    return React.createElement(route.screen, {
      route,
      navigator,
      routes,
    })
  }
}

