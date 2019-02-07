const TokensEqualTextERC721 = artifacts.require("./TokensEqualTextERC721.sol");

module.exports = deployer => {
  deployer.deploy(TokensEqualTextERC721);
};
