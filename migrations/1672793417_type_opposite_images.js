const TET998 = artifacts.require("TokensEqualTextERC998");
const TOI = artifacts.require("TypeOppositeImages");

module.exports = async (deployer) => {
  const tet998 = await TET998.deployed();
  await deployer.deploy(
    TOI,
    tet998.address,
    {
      gas: 6000000,
    }
  );
};
