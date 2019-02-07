const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");

const extraGas = require("../lib/report-extra-gas-usage.js");

const aesthetic = require("../aesthetic/aesthetic.js");

module.exports = deployer => {
  deployer.then(async () => {
    const tokensEqualTextERC998 = await TokensEqualTextERC998.deployed();
    const receipt = await tokensEqualTextERC998.mintBatch(aesthetic.num_tokens);
    await extraGas.update("minting parent tokens", receipt, deployer, web3);
  });
};
