const assert = require('assert')

const FIGURE = [
  'dolphin jumping',
  'dolphin diving',
  'dolphin swimming',
  'dolphins jumping',
  'dolphins diving',
  'dolphins swimming',
  'palm tree',
  'palm trees',
  'flamingo',
  'flamingos',
  'yellow lamborghini',
  'red lamborghini',
  'classical bust',
  'classical bust wearing shades',
  'classical plinth',
  'classical plinths',
]

const BASE = [
  'console green grid',
  'console orange grid',
  'neon green grid',
  'neon blue grid',
  'neon lime green grid',
  'console green grid landscape',
  'console orange grid landscape',
  'neon green grid landscape',
  'neon blue grid landscape',
  'neon lime green grid landscape',
  'neon pink bands in perspective',
  'thin neon pink triangle',
  'thin console green triangle',
  'chess board',
  'diagonal chess board',
  'road stretching away',
]

const BACKDROP = [
  'flat orange sun disk',
  'yellow/orange gradient sun disk',
  'purple/pink sun disk',
  'red/pink sun disk',
  'sun disk through pink haze',
  'reflected ripples',
  'reflections on the floor',
  'rippling reflection on the floor',
  'tight shadows on the floor',
  'long shadows on the floor',
  'sand dunes stretching away',
  'sand dunes at night',
  'distant mountains silhouetted',
  'distant cityscape silhouetted',
  'sparse clouds',
  'video interference interference',
]

const GROUND = [
  /*'underwater sunlight rippling',
    'waves undulating',*/
  'pink/white gradient',
  'orange/pink/purple gradient',
  'pink/blue gradient',
  'cyan/navy blue gradient',
  'cyan/pink gradient',
  'orange/black gradient',
  'purple/magenta gradient',
  'static black',
  'glitched black',
  'flat warm blue-black',
  'starfield',
  'glitched starfield',
  'mach-banded starfield',
  'clouds',
  'stars seen through clouds',
  'cyan gaussian noise',
]

const ELEMENTS = [FIGURE, BASE, BACKDROP, GROUND]

assert.ok(ELEMENTS.every((val, i, arr) => val.length == arr[0].length))

ELEMENTS.forEach(items => items.forEach(item => console.log(item)))

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

ELEMENTS.forEach(shuffleArray)

for (let i = 0; i < BASE.length; i++) {
  console.log(ELEMENTS.map(element => element[i]).join(" -- "))
}
