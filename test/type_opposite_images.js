const TET721 = artifacts.require("TokensEqualTextERC721");
const TET998 = artifacts.require("TokensEqualTextERC998");
const TOI = artifacts.require("TypeOppositeImages");

const aesthetic = require('../aesthetic/aesthetic.js');

const NUM_TOKENS = 32;

const CITEHTSEA = require("../aesthetic/citehtsea.js");
const CITEHTSEA_KEYS = Object.keys(CITEHTSEA);
const CITEHTSEA_VALUES = Object.values(CITEHTSEA);
const CITEHTSEA_LEN = CITEHTSEA_KEYS.length;

contract('TokensEqualTextERC998', async accounts => {
  it("correct number of ERC721 tokens should exist", async () => {
    const toi = await TOI.deployed();
    assert.equal((await toi.totalSupply()).toNumber(), NUM_TOKENS);
  });

  it("reversals in contract's citehtsea should be correct", async () => {
    const toi = await TOI.deployed();
    const reversals = await toi.reverse(CITEHTSEA_KEYS);
    for (let i = 0; i < CITEHTSEA_LEN; i++) {
      assert.equal(reversals[i], CITEHTSEA_VALUES[i]);
    }
  });

  it("non-existent reversals should be null", async () => {
    const toi = await TOI.deployed();
    const reversals = await toi.reverse(["0x0777"]);
    assert.deepEqual(reversals, [ "0x0000000000000000000000000000000000000000000000000000000000000000" ]);
  });
 
  it("owner can transfer ERC721 tokens", async () => {
    const toi = await TOI.deployed();
    try {
      const result = await toi.transferFrom(accounts[0],
                                               accounts[1],
                                               1);
    } catch (error) {
      assert(false, "Owner should be able to transfer TOI tokens");
    }
  });

  it("only owner can transfer ERC721 tokens", async () => {
    const toi = await TOI.deployed();
    try {
      await toi.transferFrom(accounts[1],
                                accounts[2],
                                2,
                                {from: accounts[2]});
      assert(false, "TOI should throw if non-owner tries to transfer token");
    } catch (error) {}
  });

  it("token URLs can be updated", async () => {
    const tet998 = await TET998.deployed();
    await tet998.updateTokenURIBase("aaa://newurl/");
    assert.equal(await tet998.tokenURI(3), "aaa://newurl/3");
  });
});
