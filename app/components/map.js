import React from 'react'
import {
  StyleSheet,
  PropTypes,
  View,
  Text,
  Image
} from 'react-native'
import { Components  } from 'exponent'
import { throttle } from 'lodash'
import generateRandomPokemon from '../utils/randomPokemon'

const { MapView } = Components

const COUNT = 3
const THROTTLE = 3000

export default class CustomMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      trainer: {
        latitude: 0,
        longitude: 0
      },
      pokemon: []
    }

    this.spawnWildPokemon = throttle(this.spawnWildPokemon.bind(this), THROTTLE)
    this.onTrainerMoved = this.onTrainerMoved.bind(this)
  }

  onTrainerMoved(trainer) {
    this.setState({ trainer })
    this.spawnWildPokemon()
  }

  spawnWildPokemon() {
    const location = this.state.trainer

    let newPokemon = generateRandomPokemon(3, location)

    if (this.state.pokemon.length) {
      newPokemon = newPokemon.concat(this.state.pokemon.slice(0, 3))
    }

    this.setState({
      pokemon: newPokemon
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          onRegionChange={this.onTrainerMoved}
          showsUserLocation
          followsUserLocation
          scrollEnabled={false}
          showsTraffic={false}
          showsIndoors={false}
          showsPointsOfInterest={false}
        >
          <MapView.Marker
            key={'trainer'}
            image={require('../img/trainer.png')}
            coordinate={this.state.trainer}
          />

          {this.state.pokemon.map(p =>
            <MapView.Marker
              key={`${p.latitude}::${p.longitude}`}
              coordinate={p}
              onPress={() => {
                this.props.navigator.push({
                  ...this.props.routes[1],
                  params: { pokemon: p }
                })
              }}
            >
              <Image source={p.image} />
            </MapView.Marker>
          )}
        </MapView>

        <View style={styles.bubble}>
          <Text style={{ textAlign: 'center'}}>
            {`${this.state.trainer.latitude.toPrecision(7)}, ${this.state.trainer.longitude.toPrecision(7)}`}
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
})

