const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");

const extraGas = require("../lib/report-extra-gas-usage.js");

const aesthetic = require("../aesthetic/aesthetic.js");

module.exports = function(deployer, network, accounts) {
  extraGas.init(web3)
  deployer.then(async () => {
    const tokensEqualTextERC721 = await TokensEqualTextERC721.deployed();
    // We do not update transaction state for each batch, but we do
    // want to use the transaction system to store whether all batches have
    // been created. This saves on wasted gas if we have to restart the
    // migration.
    // So we skip any created batches, assuming the number of tokens hasn't
    // changed (it shouldn't during migration!) and that batch creation is
    // atomic (which it is as a transaction).
    const numExisting = await tokensEqualTextERC721.balanceOf(accounts[0]);
    let i = Math.floor(numExisting.toNumber() / aesthetic.num_tokens);
    for(; i < aesthetic.elements.length; i++) {
      const element = aesthetic.elements[i];
      const receipt = await tokensEqualTextERC721.mintBatch(aesthetic[element]);
      await extraGas.update(`minting ${element}  `, receipt, deployer, web3);
    }
  });
};
