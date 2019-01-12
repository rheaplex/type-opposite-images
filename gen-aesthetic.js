const assert = require('assert')

const ELEMENTS = {
  figures: [
    "dolphin diving",
    "dolphin jumping",
    "dolphin swimming",
    "dolphins diving",
    "dolphins jumping",
    "dolphins swimming",
    "flamingo",
    "flamingos",
    "bust of apollo",
    "bust of caesar",
    "bust of diana",
    "bust of venus",
    "bust of caesar wearing shades",
    "bust of apollo wearing shades",
    "bust of diana wearing shases",
    "bust of venus wearing shades",
    "cathode ray tube television",
    "cathode ray tube televisions",
    "classical plinth",
    "classical plinths",
    "desktop pc",
    "desktop pcs",
    "handheld video games console",
    "handheld video games consoles",
    "michaelangelo's david in shades",
    "michaelangelo's david",
    "potted fern",
    "potted ferns",
    "red sports car",
    "yellow sports car",
    "video games console",
    "video games consoles",
  ],
  
  bases: [
    "thin console green triangle",
    "thin neon pink triangle",
    "chess board",
    "diagonal chess board",
    "console green grid landscape",
    "console green grid",
    "console orange grid landscape",
    "console orange grid",
    "neon blue grid landscape",
    "neon blue grid",
    "neon blue bands in perspective",
    "neon green grid landscape",
    "neon green grid",
    "neon green bands in perspective",
    "neon lime green grid landscape",
    "neon lime green grid",
    // In perspective would be too long...
    "neon lime green bands",
    "neon pink grid landscape",
    "neon pink grid",
    "neon pink bands in perspective",
    "palm tree",
    "palm trees",
    "road running past",
    "road stretching away",
    "row of doric columns",
    "rows of doric columns",
    "velvet rope",
    "velvet ropes",
    "white drape",
    "white drapes",
    "empty window frame",
    "empty window frames",
  ],

  backdrops: [
    "yellow/orange gradient sun disk",
    "purple/pink gradient sun disk",
    "red/pink gradient sun disk",
    "flat orange sun disk",
    "flat pink sun disk",
    "flat yellow sun disk",
    "distant cityscape silhouetted",
    "distant mountains silhouetted",
    "tight shadows on the ground",
    "long shadows on the ground",
    "distant lights",
    "reflected lights",
    "reflected ripples",
    "reflections on the ground",
    "reflections ripple on the ground",
    "sand dunes at night",
    "sand dunes stretching away",
    "video interference band",
    "video interference bands",
    "glitch band",
    "glitch bands",
    "falling rain",
    "falling rain catching the light",
    "heat haze",
    "pale mist",
    "lightning bolt",
    "lightning bolts",
    "shooting star",
    "shooting stars",
    "full moon",
    "solar eclipse",
    "lunar eclipse",
  ],

  grounds: [
    "beams of underwater sunlight",
    "beams of underwater moonlight",
    "ocean waves",
    "flat cyan background",
    "flat pink background",
    "flat peach background",
    "flat black background",
    "flat white background",
    "glitched black",
    "static black",
    "clouds",
    "stormclouds",
    "clouds at night",
    "stars through clouds at night",
    "stars seen through clouds",
    "starfield",
    "hyperspace starfield",
    "glitched starfield",
    "cyan gaussian noise",
    "magenta gaussian noise",
    "black gaussian noise",
    "pink/blue gradient",
    "orange/pink/purple gradient",
    "orange/black gradient",
    "pink/white gradient",
    "purple/magenta gradient",
    "cyan/pink gradient",
    "cyan/navy blue gradient",
    "purple/cyan gradient",
    "black/peach gradient",
    "sunrise sky",
    "sunset sky",
  ]
}

const NUM_ITEMS = 32

const ELEMENTS_NAMES = [ 'figures', 'bases', 'backdrops', 'grounds' ]

assert.deepStrictEqual(Object.keys(ELEMENTS), ELEMENTS_NAMES)

ELEMENTS_NAMES.forEach(name => assert.equal(ELEMENTS[name].length,
                                            NUM_ITEMS,
                                            ELEMENTS[name]
                                            + ': '
                                            + ELEMENTS[name].length))

ELEMENTS_NAMES.forEach(name => ELEMENTS[name]
                       .forEach(item => assert.ok(item.length <= 32, item)))

// https://stackoverflow.com/a/12646864

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    //[array[i], array[j]] = [array[j], array[i]]
    let temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

const strToHex = str => {
  let hex = ''
  for (let i = 0; i < str.length; i++) {
    hex += str.charCodeAt(i).toString(16)
  }
  return hex.padEnd(64, '0')
}

const dump = (name, elements) => {
  console.log(`  ${name}: [`)
  elements.forEach(element => console.log(`    "0x${strToHex(element)}",`))
  console.log("  ],")
}

ELEMENTS_NAMES.forEach(name => shuffleArray(ELEMENTS[name]))

console.log('/*')
for(let i = 0; i < NUM_ITEMS; i++) {
  console.log(ELEMENTS_NAMES.map(name => ELEMENTS[name][i]).join(' -- '))
}
console.log("*/\n")

console.log('var aesthetic = {')
ELEMENTS_NAMES.forEach(name => dump(name, ELEMENTS[name]))
console.log(`  elements: [ "${ELEMENTS_NAMES.join('", "')}" ],`)
console.log(`  num_tokens: ${NUM_ITEMS},`)
console.log("}\n")
console.log('if (typeof module !== "undefined") {')
console.log('  module.exports = aesthetic')
console.log('}')
