const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");
const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");

const aesthetic = require('../aesthetic/aesthetic.js');

function bnToStr(bn) {
  let hex = bn.toString(16);
  let str = '0x';
  for (let i = 0; i < hex.length; i += 2) {
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return str;
 }

contract('TokensEqualTextERC998', async accounts => {

  it("correct number of ERC721 tokens should exist", async () => {
    const erc721 = await TokensEqualTextERC721.deployed();
    const numChildren = await erc721.totalSupply();
    assert.equal(numChildren.toNumber(),
                 aesthetic.figures.length
                 + aesthetic.bases.length
                 + aesthetic.backdrops.length
                 + aesthetic.grounds.length);
  });

  it("ERC721 tokens have correct IDs in correct order", async () => {
    const erc721 = await TokensEqualTextERC721.deployed();
    let tokenIndex = 0;
    for(let i = 0; i < aesthetic.elements; i++) {
      for (let j = 0; j < aesthetic[aesthetic.elements[i]].length; j++) {
        const childToken = await erc721.tokenByIndex(tokenIndex);
        assert.equal(childToken.toString(16),
                     aesthetic[aesthetic.elements[i]][j],
                     "ERC721 Token " + tokenIndex + " has wrong ID");
        tokenIndex++;
      }
    }
  });

  it("correct number of ERC998 tokens should exist", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const numChildren = await erc998.totalChildContracts(aesthetic.num_tokens
                                                         + 1);
    assert.equal(numChildren.toNumber(), 0);
  });

  it("ERC998 tokens should each have 1 child contract", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let i = 1; i <= aesthetic.num_tokens; i++) {
      const numChildren = await erc998.totalChildContracts(i);
      assert.equal(numChildren.toNumber(),
                   1,
                   "ERC998 token" + i + "has wrong number of child contracts");
    }
  });

  it("ERC998 tokens should own 4 ERC721 child tokens each", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let i = 1; i <= aesthetic.num_tokens; i++) {
      const childContract = await erc998.childContractByIndex(i, 0);
      const total = await erc998.totalChildTokens(i, childContract);
      assert.equal(total.toNumber(),
                   4,
                   "ERC998 token" + i + "has wrong number of children");
    }
  });

  it("ERC998 tokens should own correct ERC721 child tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let tokenID = 1; tokenID <= aesthetic.num_tokens; tokenID++) {
      const childContract = await erc998.childContractByIndex(tokenID, 0);
      for(let i = 0; i < 4; i++) {
        const childToken = await erc998.childTokenByIndex(tokenID,
                                                          childContract,
                                                          i);
        // TokenID -1 will be the index in the original (zero indexed) arrays
        assert.equal('0x' + childToken.toString(16),
                     aesthetic[aesthetic.elements[i]][tokenID - 1],
                     "ERC998 token" + i + "has wrong children");
      }
    }
  });

  it("only owner can batch mint ERC721 tokens", async () => {
    const erc721 = await TokensEqualTextERC721.deployed();
    try {
      await erc721.mintBatch(accounts[1],
                             [100, 200, 300],
                             {from: accounts[1]});
      assert(false, "ERC721 should throw if non-owner calls mintBatch");
    } catch (error) {}
  });

  it("only owner can batch mint ERC998 tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const erc721 = await TokensEqualTextERC721.deployed();
    try {
      await erc998.mintTokenWithChildTokens(accounts[1],
                                            erc721.address,
                                            [100, 200, 300],
                                            {from: accounts[1]});
      assert(true, "ERC998 should throw if non-owner calls mintBatch");
    } catch (error) {}
  });

  it("owner can transfer ERC998 tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    try {
      const result = await erc998.transferFrom(accounts[0],
                                               accounts[1],
                                               1);
    } catch (error) {
      assert(false, "Owner should be able to transfer ERC998 tokens");
    }
  });

  it("only owner can transfer ERC998 tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    try {
      await erc998.transferFrom(accounts[1],
                                accounts[2],
                                2,
                                {from: accounts[2]});
      assert(false, "ERC998 should throw if non-owner tries to transfer token");
    } catch (error) {}
  });

  it("owner of ERC998 token can transfer child tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const erc721 = await TokensEqualTextERC721.deployed();
    const token3_0 = await erc998.childTokenByIndex(3, erc721.address, 0)
    try {
      const result = await erc998.transferChild(3,
                                                accounts[3],
                                                erc721.address,
                                                token3_0);
    } catch (error) {
      assert(false, "Owner should be able to transfer ERC998 child tokens");
    }
  });


  it("only owner of ERC998 token can transfer child tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const erc721 = await TokensEqualTextERC721.deployed();
    const token3_1 = await erc998.childTokenByIndex(3, erc721.address, 1)
    try {
      const result = await erc998.transferChild(3,
                                                accounts[3],
                                                erc721.address,
                                                token3_1,
                                                {from: accounts[4]});
      assert(false, "Only owner should be able to transfer child tokens");
    } catch (error) {}
  });

  it("token URLs are correct", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const uri = await erc998.tokenURI(3);
    assert.equal(uri, "https://robmyers.org/tokens-equal-text/3");
  });

  it("token URLs can be updated", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    await erc998.updateTokenURIBase("aaa://newurl/");
    const uri = await erc998.tokenURI(3);
    assert.equal(uri, "aaa://newurl/3");
  });

  it("ERC721 Enumeration interface: correct count of tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const total = await erc998.totalSupply();
    assert.equal(total.toNumber(), aesthetic.num_tokens);
  });

  it("ERC721 Enumeration interface: correct token by index", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let i = 0; i < aesthetic.num_tokens; i++) {
      const id = await erc998.tokenByIndex(i);
      // This is how we calculate the IDs internally, naughty detail exposing
      assert.equal(id.toNumber(), i + 1);
    }
  });

  it("ERC721 Enumeration interface: correct owner token by index", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    let balance = await erc998.balanceOf(accounts[2]);
    for (let i = 0; i < balance; i++) {
      const id = await erc998.tokenOfOwnerByIndex(accounts[2], i);
      // This is how we calculate the IDs internally, naughty detail exposing
      //assert.equal(id.toNumber(), i + 1);
      console.log(id.toNumber())
    }
  });
  
  
});
