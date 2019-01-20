const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");
const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");

const aesthetic = require("../aesthetic/aesthetic.js");

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const tokensEqualTextERC721 = await deployer.deploy(TokensEqualTextERC721);
    await tokensEqualTextERC721.mintBatch(aesthetic.figures);
    await tokensEqualTextERC721.mintBatch(aesthetic.bases);
    await tokensEqualTextERC721.mintBatch(aesthetic.backdrops);
    await tokensEqualTextERC721.mintBatch(aesthetic.grounds);
    const tokensEqualTextERC998 = await deployer.deploy(TokensEqualTextERC998);
    await tokensEqualTextERC998.mintBatch(aesthetic.num_tokens);
    for(let i = 0; i < aesthetic.num_tokens; i++) {
      const erc998ParentToken = i + 1;
      await tokensEqualTextERC721.safeTransferToERC998Batch(
        tokensEqualTextERC998.address,
        erc998ParentToken,
        [aesthetic.figures[i],
         aesthetic.bases[i],
         aesthetic.backdrops[i],
         aesthetic.grounds[i]]
      );
    }
  });
};
