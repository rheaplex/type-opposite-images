const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");
const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");

const extraGas = require("../lib/report-extra-gas-usage.js");

const aesthetic = require("../aesthetic/aesthetic.js");

module.exports = deployer => {
  deployer.then(async () => {
    const tokensEqualTextERC721 = await TokensEqualTextERC721.deployed();
    const tokensEqualTextERC998 = await TokensEqualTextERC998.deployed();
    deployer.logger.log("   Composing TokenEqualsTextERC998 Tokens")
    deployer.logger.log("   -------------------------------------")
    for(let i = 0; i < aesthetic.num_tokens; i++) {
      const erc998ParentToken = i + 1;
      const tokenNumStr = erc998ParentToken.toString().padStart(2, " ");
      deployer.logger.log("   > adding children to token: " + tokenNumStr);
      const childTokens = [aesthetic.figures[i],
                           aesthetic.bases[i],
                           aesthetic.backdrops[i],
                           aesthetic.grounds[i]];
      // We do not update transaction state for each composition, but we do
      // want to use the transaction system to store whether all compositions
      // are complete. This saves on wasted gas if we have to restart the
      // migration.
      // We therefore check here and skip any compositions that are already
      // created, as would happen with an incomplete migration that nonetheless
      // created one or more compositions before e.g. running out of gas or
      // hitting chain congestion.
      // We are the only party that can create tokens, so this check is crude
      // but will catch creation of a composition and allow us to skip it
      // (it doesn't check for *correct* creation, which is atomic on the
      // blockchain).
      const numChildren = await tokensEqualTextERC998
            .totalChildTokens(erc998ParentToken, tokensEqualTextERC721.address);
      if (numChildren.toNumber() == childTokens.length) {
        console.log("   > Token already has children, skipping")
        continue;
      }
      receipt = await tokensEqualTextERC721.safeTransferToERC998Batch(
        tokensEqualTextERC998.address,
        erc998ParentToken,
        childTokens
      );
      await extraGas.update("cost for token " + tokenNumStr, receipt, deployer,
                            web3);
    }
    extraGas.report(deployer, web3);
  });
};
