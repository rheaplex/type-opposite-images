const TOI = artifacts.require("TypeOppositeImages");

const CITEHTSEA = require("../aesthetic/citehtsea.js");
const CITEHTSEA_KEYS = Object.keys(CITEHTSEA);
const CITEHTSEA_VALUES = Object.values(CITEHTSEA);
const CITEHTSEA_LEN = CITEHTSEA_KEYS.length;

const STRIDE = CITEHTSEA_LEN; // 32
// In case of needing to restart.
const START = 0;


module.exports = async (deployer) => {
  const toi = await TOI.deployed();
  for (let i = START; i < CITEHTSEA_LEN; i += STRIDE) {
    const end = Math.min(STRIDE, CITEHTSEA_LEN - i);
    const aesthetics = CITEHTSEA_KEYS.slice(i, end);
    const scitehtsea = CITEHTSEA_VALUES.slice(i, end);
    await toi.addCitehtsea(
      aesthetics,
      scitehtsea,
      {
        gas: 6000000,
      }
    );
  }
};
