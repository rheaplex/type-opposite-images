const _citehtsea = {
  "beams of underwater moonlight": "radioactive wasteland",
  "beams of underwater sunlight": "burning skies",
  "black haze": "black rain",
  "black/peach gradient": "yellow/black warning stripes",
  "bust of apollo wearing shades": "tracked drone firing",
  "bust of apollo": "tracked drone",
  "bust of caesar wearing shades": "wheeled drone firing",
  "bust of caesar": "wheeled drone",
  "bust of diana wearing shades": "quadruped drone attacking",
  "bust of diana": "quadruped drone",
  "bust of venus wearing shades": "hexapod drone attacking",
  "bust of venus": "hexapod drone",
  "cathode ray tube television": "flames in a broken television",
  "cathode ray tube televisions": "flames in broken televisions",
  "chess board": "ai targeting system searching",
  "classical pedestal": "collapsed pylon",
  "classical pedestals": "collapsed pylons",
  "clouds at night": "environmental collapse",
  "clouds": "hostile artificial intelligence",
  "cyan haze": "nuclear flash",
  "cyan/navy blue gradient": "city blast radii",
  "cyan/pink gradient": "gamma radiation",
  "dark skies": "stormclouds",
  "desktop pc": "computer virus",
  "desktop pcs": "computer viruses",
  "diagonal chess board": "ai target labeling",
  "distant cityscape silhouetted": "blasted cityscape",
  "distant lights": "nuclear silhouette skyline",
  "distant mountains silhouetted": "shattered ruins",
  "dolphin diving": "aerial drone firing",
  "dolphin jumping": "aerial drone circling",
  "dolphin swimming": "aerial drone overhead",
  "dolphins diving": "aerial drones attacking",
  "dolphins jumping": "aerial drones circling",
  "dolphins swimming": "aerial drones overhead",
  "empty window frame": "blown out window",
  "empty window frames": "blown out windows",
  "falling rain catching the light": "icbms arching overhead",
  "falling rain": "lightning arcing",
  "flamingo": "icbm launch",
  "flamingos": "icbm launches",
  "flat black background": "fields of ash",
  "flat cyan background": "residual radiation",
  "flat orange sun disk": "burned out cars",
  "flat peach background": "nuclear winter",
  "flat pink background": "nuclear fireball",
  "flat pink sun disk": "dust storm",
  "flat white background": "radioactive debris cloud",
  "flat yellow sun disk": "collapsed buildings",
  "full moon": "nuclear warhead impact",
  "glitch streak": "mushroom cloud",
  "glitch streaks": "nuclear crater",
  "glitched black": "mushroom clouds",
  "glitched starfield": "smoke trails",
  "handheld video game console": "electronic countermeasures",
  "handheld video game consoles": "improvised explosive device",
  "heat haze": "smoke cloud billowing",
  "hyperspace starfield": "nuclear flash",
  "lightning bolt": "mangled wreckage",
  "lightning bolts": "burned out mangled wreckage",
  "long shadows on the ground": "mangled wreckage aflame",
  "lunar eclipse": "heat haze",
  "magenta haze": "nuclear apocalypse",
  "michelangelo's david in shades": "bipedal drone firing",
  "michelangelo's david": "bipedal drone",
  "neon blue bands in perspective": "human skulls",
  "neon blue grid landscape": "melted wreckage",
  "neon blue grid": "melted sand",
  "neon green bands in perspective": "targeting laser",
  "neon green grid landscape": "targeting lasers",
  "neon green grid": "tactical displays",
  "neon lime green bands": "gnarled blasted stumps of trees",
  "neon lime green grid landscape": "missile silo",
  "neon lime green grid": "fallout shelter",
  "neon pink bands in perspective": "vapor trails",
  "neon pink grid landscape": "twisted metal",
  "neon pink grid": "ground zero glowing",
  "ocean waves": "shock front",
  "orange/black gradient": "ash falling",
  "orange/pink/purple gradient": "embers falling",
  "outer space": "city blast radius",
  "pale mist": "blast wave",
  "palm tree": "gnarled blasted stump of a tree",
  "palm trees": "broken glass",
  "phosphor amber grid landscape": "cracked lcd",
  "phosphor amber grid": "cracked lcd glitching",
  "phosphor green grid landscape": "broken kindle on a wall",
  "phosphor green grid": "broken kindles on a wall",
  "pink/blue gradient": "nuclear famine",
  "pink/white gradient": "endless night",
  "potted fern": "dead vegetation",
  "potted ferns": "dead birds",
  "purple/cyan gradient": "yelllow/red warning stripes",
  "purple/magenta gradient": "x rays",
  "purple/pink gradient sun disk": "ionizing radiation",
  "red sports car": "cruise missile",
  "red/pink gradient sun disk": "thermal radiation",
  "reflected lights": "shockwave",
  "reflected ripples": "flash blindness",
  "reflections on the ground": "scorched earth",
  "reflections ripple on the ground": "firestorm",
  "road running past": "burned out cars on a highway",
  "road stretching away": "targeting overlay",
  "row of doric columns": "collapsed bridge",
  "rows of doric columns": "collapsed bridges",
  "sand dunes at night": "thermal pulse",
  "sand dunes stretching away": "heat wave",
  "shooting star": "ground shock",
  "shooting stars": "ground zero",
  "solar eclipse": "debris burning up on reentry",
  "stars seen through clouds": "nuclear blast",
  "stars through clouds at night": "nuclear exchange",
  "static black": "pressure wave",
  "storm clouds": "human extinction",
  "sunrise sky": "air burst",
  "sunset sky": "ground burst",
  "thin neon pink triangle": "night vision blur",
  "thin phosphor green triangle": "mirv impact",
  "tight shadows on the ground": "electromagnetic pulse",
  "velvet rope": "acid rain falling",
  "velvet ropes": "acid rain falling heavily",
  "video distortion": "nuclear detonation",
  "video game console": "smart bomb",
  "video game consoles": "smart bombs",
  "video interference": "burning refinery",
  "white drape": "fallout",
  "white drapes": "fallout drifting down",
  "yellow sports car": "destroyed personnel",
  "yellow/orange gradient sun disk": "vortex ring",
};

const toBytes32 = (str) =>
      "0x" +
      str.split("")
      .reduce((hex,c)=>hex+=c.charCodeAt(0)
              .toString(16)
              .padStart(2,"0"),
              "")
      .padEnd(64, "0");

// Make sure we don't overflow bytes32.

Object.entries(_citehtsea).map(([k, v]) => {
  if (v.length > 32) {
    console.error(`${v} is too long!!!!!!!!`);
  }
});

const citehtsea = Object.fromEntries(
  new Map(
    Object.entries(_citehtsea).map(([k, v]) => [toBytes32(k), toBytes32(v)])
  )
);

if (typeof module !== "undefined") {
  module.exports = citehtsea;
}
