pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Mintable.sol";

contract TokensEqualTextERC721 is ERC721Full, Ownable {
    constructor() public
        ERC721Full("Tokens Equals Text ERC-721", "TET721")
    {}

    function mintBatch(address _owner, uint256[] calldata _tokenIDs)
        onlyOwner
        external
    {
        require(_owner != address(0x0), "_owner must not be 0x0");
        for(uint256 i = 0; i < _tokenIDs.length; i++) {
            _mint(_owner, _tokenIDs[i]);
        }
    }
}
