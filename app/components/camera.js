import React from 'react'
import {
  Animated,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  PanResponder,
  View,
  Text,
  Image,
  Dimensions,
  DeviceEventEmitter
} from 'react-native'
import Exponent, {
  Permissions,
  Components,
  Gyroscope
} from 'exponent'

const { BarCodeScanner } = Components
const { height, width } = Dimensions.get('window')


export default class Example extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hasCameraPermission: null,
      captured: false
    }

    // set up refs
    this.gyroTracker = null

    // Set up animations
    this.animatedPokemonPosition = new Animated.ValueXY()
    this.pokemonPosition = { x: 0, y: 0 }

    this.animatedPokeball = new Animated.ValueXY()

    this.interpolatedRotateAnimation = this.animatedPokeball.x.interpolate({
      inputRange: [0, width/2, width],
      outputRange: ['-360deg', '0deg', '360deg']
    })

    // Set up touch handlers
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponderCapture: () => true,

      onPanResponderMove: Animated.event([null,
        { dx: this.animatedPokeball.x, dy: this.animatedPokeball.y }
      ]),

      onPanResponderRelease: (event, gesture) => {
        if (this.isCaptured(gesture)) {
          this.setState({ captured: true }, () => {
            setTimeout(this.goBack, 1500)
          })
        }
        else {
          Animated.spring(
            this.animatedPokeball,
            { toValue: { x: 0, y: 0 } }
          ).start()
        }
      }
    })

    // Bind component methods
    this.goBack = this.goBack.bind(this)
    this.trackGyrometer = this.trackGyrometer.bind(this)
    this.isCaptured = this.isCaptured.bind(this)
  }

  componentWillMount() {
    Permissions.askAsync(Permissions.CAMERA)
      .then(({ status }) => {
        this.setState({
          hasCameraPermission: status === 'granted'
        })
      })
  }

  componentDidMount() {
    Gyroscope.setUpdateInterval(50)

    Gyroscope.addListener(
      this.trackGyrometer(
        Animated.event([
          { x: this.animatedPokemonPosition.x, y: this.animatedPokemonPosition.y }
        ])
      )
    )
  }

  componentWillUnmount() {
    Gyroscope.removeAllListeners()
  }

  trackGyrometer(eventHandler) {
    return (data) => {
      this.pokemonPosition.x += ((data.y - 0.03) * 30)
      this.pokemonPosition.y += ((data.x + 0.05) * 30)

      eventHandler(this.pokemonPosition)
    }
  }

  goBack() {
    this.props.navigator.pop()
  }

  isCaptured(gesture) {
    const pokeballX = gesture.moveX
    const pokeballY = gesture.moveY

    const pokemonX = (width/2) + this.pokemonPosition.x
    const pokemonY = (height/3) + this.pokemonPosition.y

   return ((Math.abs((pokeballX - pokemonX)) < 50) && (Math.abs((pokeballY - pokemonY)) < 50))
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar animated hidden />

        {this.state.hasCameraPermission && (
          <BarCodeScanner
            style={styles.camera}
            type={'back'}
            onBarCodeRead={() => {}}
          />
        )}

        {this.state.captured ? (
          <View style={[styles.overlay, styles.captureOverlay]}>
            <Text style={styles.cancelText}>
              Pokemon Captured!
            </Text>
          </View>
        ) : (
          <Animated.Image
            source={this.props.route.params.pokemon.image}
            style={[styles.pokemon, {
              transform: [
                { translateX: this.animatedPokemonPosition.x },
                { translateY: this.animatedPokemonPosition.y }
              ]
            }]}
          />
        )}

        <View style={[styles.overlay, styles.topOverlay]}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={this.goBack}
          >
            <Text style={styles.cancelText}>X</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.overlay, styles.bottomOverlay]}>
          <Animated.Image
            source={require('../img/pokeball.png')}
            style={{
              transform: [
                { translateX: this.animatedPokeball.x },
                { translateY: this.animatedPokeball.y },
                { rotate: this.interpolatedRotateAnimation }
              ]
            }}
            { ...this.panResponder.panHandlers }
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  bottomOverlay: {
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  captureOverlay: {
    top: width/4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cancelButton: {
    padding: 15,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 28
  },
  pokemon: {
    position: 'absolute',
    top: height/3,
    bottom: height/3,
    right: width/3,
    left: width/3
  },
})
