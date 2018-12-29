pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";

contract TokensEqualTextERC721 is ERC721Full, Ownable {

    constructor() public
        ERC721Full("Tokens Equal Text ERC-721", "TET721")
    {}

    function mintBatch(uint256[] calldata _tokenIDs)
        onlyOwner
        external
    {
        for(uint256 i = 0; i < _tokenIDs.length; i++) {
            // msg.sender will be owner, saving a call to owner()
            _mint(msg.sender, _tokenIDs[i]);
        }
    }

    // This is pretty much mutual reference / cross-linking, which is bad.
    // It's here to save gas and prevent access control issues (which would
    // require even more gas to resolve).

    function safeTransferToERC998Batch(
        address _erc998Contract,
        uint256 _erc998ParentTokenID,
        uint256[] calldata _tokenIDs
    ) onlyOwner external
    {
        require(_erc998Contract != address(0x0), "Cannot transfer to 0x0");
        bytes memory data = abi.encodePacked(_erc998ParentTokenID);
        for(uint i = 0; i < _tokenIDs.length; i++) {
            // msg.sender will be owner, saving a call to owner()
            safeTransferFrom(msg.sender,
                             _erc998Contract,
                             _tokenIDs[i],
                             data);
        }
    }

}
