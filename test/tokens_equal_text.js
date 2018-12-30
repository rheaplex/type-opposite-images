const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");
const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");

const FIGURES = [
  "636c6173736963616c20706c696e746873000000000000000000000000000000",
  "726564206c616d626f726768696e690000000000000000000000000000000000",
  "70616c6d20747265650000000000000000000000000000000000000000000000",
  "636c6173736963616c2062757374000000000000000000000000000000000000",
  "646f6c7068696e206a756d70696e670000000000000000000000000000000000",
  "646f6c7068696e7320646976696e670000000000000000000000000000000000",
  "666c616d696e676f000000000000000000000000000000000000000000000000",
  "79656c6c6f77206c616d626f726768696e690000000000000000000000000000",
  "646f6c7068696e73207377696d6d696e67000000000000000000000000000000",
  "646f6c7068696e20646976696e67000000000000000000000000000000000000",
  "70616c6d20747265657300000000000000000000000000000000000000000000",
  "646f6c7068696e73206a756d70696e6700000000000000000000000000000000",
  "646f6c7068696e207377696d6d696e6700000000000000000000000000000000",
  "666c616d696e676f730000000000000000000000000000000000000000000000",
  "636c6173736963616c20627573742077656172696e6720736861646573000000",
  "636c6173736963616c20706c696e746800000000000000000000000000000000"
];

const BASES = [
  "6e656f6e20626c75652067726964000000000000000000000000000000000000",
  "636f6e736f6c6520677265656e20677269640000000000000000000000000000",
  "6e656f6e206c696d6520677265656e2067726964000000000000000000000000",
  "7468696e206e656f6e2070696e6b20747269616e676c65000000000000000000",
  "6e656f6e2070696e6b2062616e647320696e2070657273706563746976650000",
  "6e656f6e20677265656e20677269640000000000000000000000000000000000",
  "636f6e736f6c65206f72616e67652067726964206c616e647363617065000000",
  "636f6e736f6c65206f72616e6765206772696400000000000000000000000000",
  "726f61642073747265746368696e672061776179000000000000000000000000",
  "7468696e20636f6e736f6c6520677265656e20747269616e676c650000000000",
  "6e656f6e20677265656e2067726964206c616e64736361706500000000000000",
  "6e656f6e20626c75652067726964206c616e6473636170650000000000000000",
  "646961676f6e616c20636865737320626f617264000000000000000000000000",
  "636f6e736f6c6520677265656e2067726964206c616e64736361706500000000",
  "6e656f6e206c696d6520677265656e2067726964206c616e6473636170650000",
  "636865737320626f617264000000000000000000000000000000000000000000"
];

const BACKDROPS = [
  "707572706c652f70696e6b2073756e206469736b000000000000000000000000",
  "73756e206469736b207468726f7567682070696e6b2068617a65000000000000",
  "766964656f20696e746572666572656e63650000000000000000000000000000",
  "7265666c656374656420726970706c6573000000000000000000000000000000",
  "64697374616e74206369747973636170652073696c686f756574746564000000",
  "73706172736520636c6f75647300000000000000000000000000000000000000",
  "666c6174206f72616e67652073756e206469736b000000000000000000000000",
  "7265666c656374696f6e7320726970706c65206f6e2074686520666c6f6f7200",
  "79656c6c6f772f6f72616e6765206772616469656e742073756e206469736b00",
  "746967687420736861646f7773206f6e2074686520666c6f6f72000000000000",
  "73616e642064756e65732073747265746368696e672061776179000000000000",
  "73616e642064756e6573206174206e6967687400000000000000000000000000",
  "6c6f6e6720736861646f7773206f6e2074686520666c6f6f7200000000000000",
  "64697374616e74206d6f756e7461696e732073696c686f756574746564000000",
  "7265666c656374696f6e73206f6e2074686520666c6f6f720000000000000000",
  "7265642f70696e6b2073756e206469736b000000000000000000000000000000"
];

const GROUNDS = [
  "6379616e2f70696e6b206772616469656e740000000000000000000000000000",
  "676c69746368656420626c61636b000000000000000000000000000000000000",
  "636c6f7564730000000000000000000000000000000000000000000000000000",
  "6d6163682d62616e64656420737461726669656c640000000000000000000000",
  "707572706c652f6d6167656e7461206772616469656e74000000000000000000",
  "7374617273207365656e207468726f75676820636c6f75647300000000000000",
  "70696e6b2f7768697465206772616469656e7400000000000000000000000000",
  "73746174696320626c61636b0000000000000000000000000000000000000000",
  "737461726669656c640000000000000000000000000000000000000000000000",
  "676c69746368656420737461726669656c640000000000000000000000000000",
  "6f72616e67652f70696e6b2f707572706c65206772616469656e740000000000",
  "6f72616e67652f626c61636b206772616469656e740000000000000000000000",
  "6379616e20676175737369616e206e6f69736500000000000000000000000000",
  "70696e6b2f626c7565206772616469656e740000000000000000000000000000",
  "666c6174207761726d20626c75652d626c61636b000000000000000000000000",
  "6379616e2f6e61767920626c7565206772616469656e74000000000000000000"
];

const NUM_TOKENS = FIGURES.length;

const ELEMENTS = [FIGURES, BASES, BACKDROPS, GROUNDS];

function bnToStr(bn) {
  let hex = bn.toString(16);
  let str = '';
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
                 FIGURES.length
                 + BASES.length
                 + BACKDROPS.length
                 + GROUNDS.length);
  });

  it("ERC721 tokens have correct IDs in correct order", async () => {
    const erc721 = await TokensEqualTextERC721.deployed();
    let tokenIndex = 0;
    for(let i = 0; i < 4; i++) {
      for (let j = 0; j < ELEMENTS[i].length; j++) {
        const childToken = await erc721.tokenByIndex(tokenIndex);
        assert.equal(childToken.toString(16),
                     ELEMENTS[i][j],
                     "ERC721 Token " + tokenIndex + " has wrong ID");
        tokenIndex++;
      }
    }
  });

  it("correct number of ERC998 tokens should exist", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    const numChildren = await erc998.totalChildContracts(NUM_TOKENS + 1);
    assert.equal(numChildren.toNumber(), 0);
  });

  it("ERC998 tokens should each have 1 child contract", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let i = 1; i <= NUM_TOKENS; i++) {
      const numChildren = await erc998.totalChildContracts(i);
      assert.equal(numChildren.toNumber(),
                   1,
                   "ERC998 token" + i + "has wrong number of child contracts");
    }
  });

  it("ERC998 tokens should own 4 ERC721 child tokens each", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let i = 1; i <= NUM_TOKENS; i++) {
      const childContract = await erc998.childContractByIndex(i, 0);
      const total = await erc998.totalChildTokens(i, childContract);
      assert.equal(total.toNumber(),
                   4,
                   "ERC998 token" + i + "has wrong number of children");
    }
  });

  it("ERC998 tokens should own correct ERC721 child tokens", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    for (let tokenID = 1; tokenID <= NUM_TOKENS; tokenID++) {
      const childContract = await erc998.childContractByIndex(tokenID, 0);
      for(let i = 0; i < 4; i++) {
        const childToken = await erc998.childTokenByIndex(tokenID,
                                                          childContract,
                                                          i);
        // TokenID -1 will be the index in the original (zero indexed) arrays
        assert.equal(childToken.toString(16),
                     ELEMENTS[i][tokenID - 1],
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
    assert.equal(uri, "https://robmyers.org/tokens-equal-text/3")
  });

  it("token URLs can be updated", async () => {
    const erc998 = await TokensEqualTextERC998.deployed();
    await erc998.updateTokenURIBase("aaa://newurl/");
    const uri = await erc998.tokenURI(3);
    assert.equal(uri, "aaa://newurl/3")
  });

});
