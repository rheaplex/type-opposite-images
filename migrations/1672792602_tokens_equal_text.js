const TET721 = artifacts.require("TokensEqualTextERC721");
const TET998 = artifacts.require("TokensEqualTextERC998");

const aesthetic = require("../aesthetic/aesthetic.js");

const deployOnNetworks = ["develop", "test"];
const overwriteOnNetworks = ["develop", "test"];

// These are less robust than their original equivalents as they

let tet721Batch = async (tet721, account) => {
  for(let i = 0; i < aesthetic.elements.length; i++) {
    const element = aesthetic.elements[i];
    await tet721.mintBatch(
      aesthetic[element],
      {
        from: account,
        gas: 5500000
      }
    );
  }
};

let tet998Batch = async (tet998, account) => {
  return tet998.mintBatch(
    aesthetic.num_tokens,
    { from: account }
  );
};

let tetCompose = async(tet721, tet998, account) => {
  for(let i = 0; i < aesthetic.num_tokens; i++) {
    const erc998ParentToken = i + 1;
    const tokenNumStr = erc998ParentToken.toString().padStart(2, " ");
    const childTokens = [aesthetic.figures[i],
                         aesthetic.bases[i],
                         aesthetic.backdrops[i],
                         aesthetic.grounds[i]];
    const numChildren = await tet998.totalChildTokens(
      erc998ParentToken,
      tet721.address
    );
    if (numChildren.toNumber() == childTokens.length) {
      console.log("   > Token already has children, skipping");
      continue;
    }
    await tet721.safeTransferToERC998Batch(
      tet998.address,
      erc998ParentToken,
      childTokens,
      {
        from: account,
        gas: 6000000,
      }
    );
  }
};

module.exports = async (deployer, network, accounts) => {
  if(deployOnNetworks.includes(network)) {
    const shouldOverwrite = overwriteOnNetworks.includes(network);
    const account = accounts[0];
    await deployer.deploy(
      TET721,
      {
        from: account,
        overwrite: shouldOverwrite
      }
    );
    const tet721 = await TET721.deployed();
    await deployer.deploy(
      TET998,
      {
        from: account,
        overwrite: shouldOverwrite
      }
    );
    const tet998 = await TET998.deployed();
    await tet721Batch(tet721, account);
    await tet998Batch(tet998, account);
    await tetCompose(tet721, tet998, account);
  }
};
