let extraGas;
let extraGasCost;

const initGas = (web3) => {
  extraGas = web3.utils.toBN(0);
  extraGasCost = web3.utils.toBN(0);
}

const updateGas = async function(what, receipt, deployer, web3) {
  const gasAmount = web3.utils.toBN(receipt.receipt.gasUsed);
  const gasPrice = web3.utils.toBN((await web3.eth.getTransaction(receipt.tx)).gasPrice);
  const gasCost = gasAmount.mul(gasPrice);
  extraGas = extraGas.add(gasAmount);
  extraGasCost = extraGasCost.add(gasCost);
  deployer.logger.log("   > " + what
                      + ":  gas: " + gasAmount
                      + "  price(gwei): " + web3.utils.fromWei(gasPrice, 'gwei')
                      + "  cost(eth): " + web3.utils.fromWei(gasCost, 'ether'))
}

const reportExtraGas = (deployer, web3) => {
  deployer.logger.log("\nExtra gas, not included in truffle totals");
  deployer.logger.log("======================================");
  deployer.logger.log("> Extra gas used:          " + extraGas);
  deployer.logger.log("> Extra gas cost (eth):    "
                      + web3.utils.fromWei(extraGasCost, 'ether'));
  deployer.logger.log("======================================");
  deployer.logger.log("");
}

module.exports = {
  init: initGas,
  update: updateGas,
  report: reportExtraGas
}
