const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");

const extraGas = require("../lib/report-extra-gas-usage.js");

const aesthetic = require("../aesthetic/aesthetic.js");

module.exports = function(deployer, network, accounts) {
  extraGas.init(web3)
  deployer.then(async () => {
    const tokensEqualTextERC721 = await TokensEqualTextERC721.deployed();
    const numExisting = await tokensEqualTextERC721.balanceOf(accounts[0]);
    let receipt;
    // We do not update transaction state for each batch, but we do
    // want to use the transaction system to store whether all batches have
    // been created. This saves on wasted gas if we have to restart the
    // migration.
    // So we check for whether each batch has been created (which is atomic on
    // the blockchain) and skip it if it has.
    if (numExisting.eq(web3.utils.toBN(0))) {
      receipt = await tokensEqualTextERC721.mintBatch(aesthetic.figures);
      await extraGas.update("minting figures  ", receipt, deployer, web3);
    }
    if (numExisting.lt(web3.utils.toBN(aesthetic.figures.length))) {
      receipt = await tokensEqualTextERC721.mintBatch(aesthetic.bases);
      await extraGas.update("minting bases    ", receipt, deployer, web3);
    }
    if (numExisting.lt(web3.utils.toBN(aesthetic.figures.length
                                       + aesthetic.bases.length))) {
      receipt = await tokensEqualTextERC721.mintBatch(aesthetic.backdrops);
      await extraGas.update("minting backdrops", receipt, deployer, web3);
    }
    if (numExisting.lt(web3.utils.toBN(aesthetic.figures.length
                                       + aesthetic.bases.length
                                       + aesthetic.backdrops.length))) {
      receipt = await tokensEqualTextERC721.mintBatch(aesthetic.grounds);
      await extraGas.update("minting grounds  ", receipt, deployer, web3);
    }
  });
};
