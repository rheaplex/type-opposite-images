const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");
const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");

const aesthetic = require("../aesthetic/aesthetic.js");

let extraGas = web3.utils.toBN(0);
let extraGasCost = web3.utils.toBN(0);

const updateGas = async function(what, receipt, deployer) {
  const gasAmount = web3.utils.toBN(receipt.receipt.gasUsed);
  const gasPrice = web3.utils.toBN((await web3.eth.getTransaction(receipt.tx)).gasPrice);
  const gasCost = gasAmount.mul(gasPrice);
  extraGas = extraGas.add(gasAmount);
  extraGasCost = extraGasCost.add(gasCost);
  deployer.logger.log("   > " + what
                      + ": gas: " + gasAmount
                      + " price(gwei): " + web3.utils.fromWei(gasPrice, 'gwei')
                      + " cost(eth): " + web3.utils.fromWei(gasCost, 'ether'))
}

const reportExtraGas = (deployer) => {
  deployer.logger.log("\nEXTRA GAS, NOT INCLUDED IN TOTAL BELOW");
  deployer.logger.log("======================================");
  deployer.logger.log("> Extra gas used:          " + extraGas);
  deployer.logger.log("> Extra gas cost (eth):    "
                      + web3.utils.fromWei(extraGasCost, 'ether'));
  deployer.logger.log("");
}

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const tokensEqualTextERC721 = await deployer.deploy(TokensEqualTextERC721);
    let receipt = await tokensEqualTextERC721.mintBatch(aesthetic.figures);
    await updateGas("minting figures  ", receipt, deployer);
    receipt = await tokensEqualTextERC721.mintBatch(aesthetic.bases);
    await updateGas("minting bases    ", receipt, deployer);
    receipt = await tokensEqualTextERC721.mintBatch(aesthetic.backdrops);
    await updateGas("minting backdrops", receipt, deployer);
    receipt = await tokensEqualTextERC721.mintBatch(aesthetic.grounds);
    await updateGas("minting grounds  ", receipt, deployer);
    const tokensEqualTextERC998 = await deployer.deploy(TokensEqualTextERC998);
    receipt = await tokensEqualTextERC998.mintBatch(aesthetic.num_tokens);
    await updateGas("minting parent tokens", receipt, deployer);
    deployer.logger.log("   Composing TokenEqualsTextERC998 Tokens")
    deployer.logger.log("   -------------------------------------")
    for(let i = 0; i < aesthetic.num_tokens; i++) {
      const erc998ParentToken = i + 1;
      const tokenNumStr = erc998ParentToken.toString().padStart(2, " ");
      deployer.logger.log("   > adding children to token: " + tokenNumStr);
      receipt = await tokensEqualTextERC721.safeTransferToERC998Batch(
        tokensEqualTextERC998.address,
        erc998ParentToken,
        [aesthetic.figures[i],
         aesthetic.bases[i],
         aesthetic.backdrops[i],
         aesthetic.grounds[i]]
      );
      await updateGas("cost for token " + tokenNumStr, receipt, deployer);
    }
    reportExtraGas(deployer);
  });
};
