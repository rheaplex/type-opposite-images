const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");
const TokensEqualTextERC998 = artifacts.require("./TokensEqualTextERC998.sol");

const aesthetic = require("../aesthetic/aesthetic.js");

//FIXME: check that token lists are same lengths!

module.exports = (deployer, network, accounts) => {
  deployer.then(async () => {
    const tokensEqualTextERC721 = await deployer.deploy(TokensEqualTextERC721);
    await tokensEqualTextERC721.mintBatch(aesthetic.FIGURES);
    await tokensEqualTextERC721.mintBatch(aesthetic.BASES);
    await tokensEqualTextERC721.mintBatch(aesthetic.BACKDROPS);
    await tokensEqualTextERC721.mintBatch(aesthetic.GROUNDS);
    const tokensEqualTextERC998 = await deployer.deploy(TokensEqualTextERC998);
    await tokensEqualTextERC998.mintBatch(aesthetic.FIGURES.length);
    for(let i = 0; i < aesthetic.FIGURES.length; i++) {
      const erc998ParentToken = i + 1;
      await tokensEqualTextERC721.safeTransferToERC998Batch(
        tokensEqualTextERC998.address,
        erc998ParentToken,
        [aesthetic.FIGURES[i],
         aesthetic.BASES[i],
         aesthetic.BACKDROPS[i],
         aesthetic.GROUNDS[i]]
      );
    }
  });
};
