const assert = require('assert')
const fs = require('fs')

const ELEMENTS = {
    figures: [
    "desktop pcs",
    "michelangelo's david",
    "bust of apollo wearing shades",
    "bust of apollo",
    "red sports car",
    "bust of venus wearing shades",
    "potted fern",
    "yellow sports car",
    "dolphin jumping",
    "video game consoles",
    "video game console",
    "handheld video game console",
    "potted ferns",
    "dolphin diving",
    "flamingos",
    "bust of diana wearing shades",
    "classical pedestal",
    "dolphins jumping",
    "bust of caesar",
    "bust of venus",
    "handheld video game consoles",
    "classical pedestals",
    "dolphins diving",
    "dolphins swimming",
    "bust of caesar wearing shades",
    "michelangelo's david in shades",
    "cathode ray tube television",
    "dolphin swimming",
    "bust of diana",
    "desktop pc",
    "flamingo",
    "cathode ray tube televisions",
  ],

  bases: [
    "phosphor amber grid",
    "neon green grid",
    "neon blue grid landscape",
    "neon pink grid",
    "diagonal chess board",
    "rows of doric columns",
    "neon lime green grid landscape",
    "phosphor green grid",
    "white drape",
    "empty window frames",
    "neon pink bands in perspective",
    "empty window frame",
    "neon green bands in perspective",
    "palm trees",
    "velvet rope",
    "neon lime green bands",
    "velvet ropes",
    "thin phosphor green triangle",
    "neon lime green grid",
    "road running past",
    "row of doric columns",
    "thin neon pink triangle",
    "white drapes",
    "phosphor amber grid landscape",
    "neon green grid landscape",
    "neon blue bands in perspective",
    "neon blue grid",
    "chess board",
    "palm tree",
    "road stretching away",
    "neon pink grid landscape",
    "phosphor green grid landscape",
  ],

  backdrops: [
    "glitch streak",
    "reflections on the ground",
    "glitch streaks",
    "sand dunes stretching away",
    "flat pink sun disk",
    "shooting star",
    "long shadows on the ground",
    "lunar eclipse",
    "distant lights",
    "reflections ripple on the ground",
    "falling rain catching the light",
    "distant cityscape silhouetted",
    "falling rain",
    "reflected ripples",
    "tight shadows on the ground",
    "flat yellow sun disk",
    "shooting stars",
    "video distortion",
    "reflected lights",
    "lightning bolts",
    "video interference",
    "full moon",
    "distant mountains silhouetted",
    "pale mist",
    "lightning bolt",
    "solar eclipse",
    "red/pink gradient sun disk",
    "yellow/orange gradient sun disk",
    "purple/pink gradient sun disk",
    "flat orange sun disk",
    "heat haze",
    "sand dunes at night",
  ],
  
  grounds: [
    "purple/cyan gradient",
    "hyperspace starfield",
    "flat black background",
    "cyan/navy blue gradient",
    "storm clouds",
    "flat peach background",
    "glitched starfield",
    "purple/magenta gradient",
    "flat cyan background",
    "beams of underwater sunlight",
    "static black",
    "flat pink background",
    "orange/black gradient",
    "beams of underwater moonlight",
    "stars seen through clouds",
    "pink/white gradient",
    "clouds",
    "stars through clouds at night",
    "cyan haze",
    "glitched black",
    "magenta haze",
    "sunset sky",
    "pink/blue gradient",
    "cyan/pink gradient",
    "orange/pink/purple gradient",
    "clouds at night",
    "flat white background",
    "sunrise sky",
    "black haze",
    "ocean waves",
    "black/peach gradient",
    "outer space",
  ],
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
  let aesthetic = `  ${name}: [\n`
  elements.forEach(element => aesthetic += `    "0x${strToHex(element)}",\n`)
  aesthetic += "  ],\n"
  return aesthetic
}

// We did this and dumped the results back in here, so don't do it again
// as we need to copy edit etc.
//ELEMENTS_NAMES.forEach(name => shuffleArray(ELEMENTS[name]))

let aesthetic = "/*\n"
for(let i = 0; i < NUM_ITEMS; i++) {
  aesthetic += ELEMENTS_NAMES
    .map(name => ELEMENTS[name][i])
    .join(' -- ')
    + "\n"
}
aesthetic += "*/\n"

aesthetic += "var aesthetic = {\n"
ELEMENTS_NAMES.forEach(name => aesthetic += dump(name, ELEMENTS[name]))
aesthetic += `  elements: [ "${ELEMENTS_NAMES.join('", "')}" ],\n`
aesthetic += `  num_tokens: ${NUM_ITEMS},\n`
aesthetic += "}\n"
aesthetic += "if (typeof module !== \"undefined\") {\n"
aesthetic += "  module.exports = aesthetic\n"
aesthetic += "}\n"

fs.writeFile("./aesthetic/aesthetic.js", aesthetic, function(err) {
  if(err) {
    return console.log(err)
  }
})
