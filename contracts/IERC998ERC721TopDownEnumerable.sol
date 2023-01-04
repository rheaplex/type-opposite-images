/**********************************
/* Original author: Nick Mudge, <nick@perfectabstractions.com>, https://medium.com/@mudgen.
/**********************************/

//SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

interface ERC998ERC721TopDownEnumerable {
    function totalChildContracts(uint256 _tokenId) external view returns (uint256);
    function childContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address childContract);
    function totalChildTokens(uint256 _tokenId, address _childContract) external view returns (uint256);
    function childTokenByIndex(uint256 _tokenId, address _childContract, uint256 _index) external view returns (uint256 childTokenId);
}
