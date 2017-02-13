import getRandomInt from './randomInt'
import { generateRandomPoint } from './randomGeo'

const RADIUS = 300 // meters

const pokemonImages = {
  1: require('../img/pokemon/1.png'),
  2: require('../img/pokemon/2.png'),
  3: require('../img/pokemon/3.png'),
  4: require('../img/pokemon/4.png')
}

export default function createPokemon(count, location) {
  let pokemon = []

  for (let i=0; i<count; i++) {
    pokemon.push(Object.assign({
      image: pokemonImages[getRandomInt(1, 5)]
    },
    generateRandomPoint(location, RADIUS)
    ))
  }

  return pokemon
}
