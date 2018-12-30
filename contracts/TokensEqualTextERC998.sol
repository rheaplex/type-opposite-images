/**********************************
// Based in large part on ERC998: V
/* Author: Nick Mudge, <nick@perfectabstractions.com>, https://medium.com/@mudgen.
/**********************************/

//jshint ignore: start

pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol";
import "openzeppelin-solidity/contracts/token/ERC721/ERC721.sol";
import "openzeppelin-solidity/contracts/token/ERC721/IERC721Receiver.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import './Strings.sol';

interface ERC998ERC721TopDown {
    event ReceivedChild(address indexed _from, uint256 indexed _tokenId, address indexed _childContract, uint256 _childTokenId);
    event TransferChild(uint256 indexed tokenId, address indexed _to, address indexed _childContract, uint256 _childTokenId);

    function rootOwnerOf(uint256 _tokenId) external view returns (bytes32 rootOwner);
    function rootOwnerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 rootOwner);
    function ownerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 parentTokenOwner, uint256 parentTokenId);
    function onERC721Received(address _operator, address _from, uint256 _childTokenId, bytes calldata _data) external returns (bytes4);
    function transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external;
    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external;
    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId, bytes calldata _data) external;
    function transferChildToParent(uint256 _fromTokenId, address _toContract, uint256 _toTokenId, address _childContract, uint256 _childTokenId, bytes calldata _data) external;
    // getChild function enables older contracts like cryptokitties to be transferred into a composable
    // The _childContract must approve this contract. Then getChild can be called.
    function getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external;
}

interface ERC998ERC721TopDownEnumerable {
    function totalChildContracts(uint256 _tokenId) external view returns (uint256);
    function childContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address childContract);
    function totalChildTokens(uint256 _tokenId, address _childContract) external view returns (uint256);
    function childTokenByIndex(uint256 _tokenId, address _childContract, uint256 _index) external view returns (uint256 childTokenId);
}

interface ERC998ERC721BottomUp {
    function transferToParent(address _from, address _toContract, uint256 _toTokenId, uint256 _tokenId, bytes calldata _data) external;
}


contract TokensEqualTextERC998 is
ERC721, ERC998ERC721TopDown, ERC998ERC721TopDownEnumerable, Ownable
{
    // return this.rootOwnerOf.selector ^ this.rootOwnerOfChild.selector ^
    //   this.tokenOwnerOf.selector ^ this.ownerOfChild.selector;
    bytes32 constant ERC998_MAGIC_VALUE = bytes32(uint256(0xcd740db5));

    uint256 tokenCount = 0;

    // tokenId => token owner
    mapping(uint256 => address) internal tokenIdToTokenOwner;

    // root token owner address => (tokenId => approved address)
    mapping(address => mapping(uint256 => address)) internal rootOwnerAndTokenIdToApprovedAddress;

    // token owner address => token count
    mapping(address => uint256) internal tokenOwnerToTokenCount;

    // token owner => (operator address => bool)
    mapping(address => mapping(address => bool)) internal tokenOwnerToOperators;

    //from zepellin ERC721Receiver.sol
    //old version
    bytes4 constant ERC721_RECEIVED_OLD = 0xf0b9e5ba;
    //new version
    bytes4 constant ERC721_RECEIVED_NEW = 0x150b7a02;

    ////////////////////////////////////////////////////////
    // ERC721 implementation
    ////////////////////////////////////////////////////////

    function isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {size := extcodesize(_addr)}
        return size > 0;
    }

    function rootOwnerOf(uint256 _tokenId) public view returns (bytes32 rootOwner) {
        return rootOwnerOfChild(address(0), _tokenId);
    }

    // returns the owner at the top of the tree of composables
    // Use Cases handled:
    // Case 1: Token owner is this contract and token.
    // Case 2: Token owner is other top-down composable
    // Case 3: Token owner is other contract
    // Case 4: Token owner is user
    function rootOwnerOfChild(address _childContract, uint256 _childTokenId) public view returns (bytes32 rootOwner) {
        address rootOwnerAddress;
        if (_childContract != address(0)) {
            (rootOwnerAddress, _childTokenId) = _ownerOfChild(_childContract, _childTokenId);
        }
        else {
            rootOwnerAddress = tokenIdToTokenOwner[_childTokenId];
        }
        // Case 1: Token owner is this contract and token.
        while (rootOwnerAddress == address(this)) {
            (rootOwnerAddress, _childTokenId) = _ownerOfChild(rootOwnerAddress, _childTokenId);
        }

        bool callSuccess;
        bytes memory callData;
        // 0xed81cdda == rootOwnerOfChild(address,uint256)
        callData = abi.encodeWithSelector(0xed81cdda, address(this), _childTokenId);
        assembly {
            callSuccess := staticcall(gas, rootOwnerAddress, add(callData, 0x20), mload(callData), callData, 0x20)
            if callSuccess {
                rootOwner := mload(callData)
            }
        }
        if(callSuccess == true && rootOwner >> 224 == ERC998_MAGIC_VALUE) {
            // Case 2: Token owner is other top-down composable
            return rootOwner;
        }
        else {
            // Case 3: Token owner is other contract
            // Or
            // Case 4: Token owner is user
            return ERC998_MAGIC_VALUE << 224 | bytes32(uint256(rootOwnerAddress));
        }
    }


    // returns the owner at the top of the tree of composables

    function ownerOf(uint256 _tokenId) public view returns (address tokenOwner) {
        tokenOwner = tokenIdToTokenOwner[_tokenId];
        require(tokenOwner != address(0));
        return tokenOwner;
    }

    function balanceOf(address _tokenOwner) public view returns (uint256) {
        require(_tokenOwner != address(0));
        return tokenOwnerToTokenCount[_tokenOwner];
    }


    function approve(address _approved, uint256 _tokenId) public {
        address rootOwner = address(uint256(rootOwnerOf(_tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender]);
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId] = _approved;
        emit Approval(rootOwner, _approved, _tokenId);
    }

    function getApproved(uint256 _tokenId) public view returns (address)  {
        address rootOwner = address(uint256(rootOwnerOf(_tokenId)));
        return rootOwnerAndTokenIdToApprovedAddress[rootOwner][_tokenId];
    }

    function setApprovalForAll(address _operator, bool _approved) public {
        require(_operator != address(0));
        tokenOwnerToOperators[msg.sender][_operator] = _approved;
        emit ApprovalForAll(msg.sender, _operator, _approved);
    }

    function isApprovedForAll(address _owner, address _operator) public view returns (bool)  {
        require(_owner != address(0));
        require(_operator != address(0));
        return tokenOwnerToOperators[_owner][_operator];
    }

    function _transferFrom(address _from, address _to, uint256 _tokenId) internal {
        require(_from != address(0));
        require(tokenIdToTokenOwner[_tokenId] == _from);
        require(_to != address(0));

        if(msg.sender != _from) {
            bytes32 rootOwner;
            bool callSuccess;
            // 0xed81cdda == rootOwnerOfChild(address,uint256)
            bytes memory callData = abi.encodeWithSelector(0xed81cdda, address(this), _tokenId);
            assembly {
                callSuccess := staticcall(gas, _from, add(callData, 0x20), mload(callData), callData, 0x20)
                if callSuccess {
                    rootOwner := mload(callData)
                }
            }
            if(callSuccess == true) {
                require(rootOwner >> 224 != ERC998_MAGIC_VALUE, "Token is child of other top down composable");
            }
            require(tokenOwnerToOperators[_from][msg.sender] ||
            rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId] == msg.sender);
        }

        // clear approval
        if (rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId] != address(0)) {
            delete rootOwnerAndTokenIdToApprovedAddress[_from][_tokenId];
            emit Approval(_from, address(0), _tokenId);
        }

        // remove and transfer token
        if (_from != _to) {
            assert(tokenOwnerToTokenCount[_from] > 0);
            tokenOwnerToTokenCount[_from]--;
            tokenIdToTokenOwner[_tokenId] = _to;
            tokenOwnerToTokenCount[_to]++;
        }
        emit Transfer(_from, _to, _tokenId);

    }

    function transferFrom(address _from, address _to, uint256 _tokenId) public {
        _transferFrom(_from, _to, _tokenId);
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId) public {
        _transferFrom(_from, _to, _tokenId);
        if (isContract(_to)) {
            bytes4 retval = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, "");
            require(retval == ERC721_RECEIVED_OLD);
        }
    }

    function safeTransferFrom(address _from, address _to, uint256 _tokenId, bytes memory _data) public {
        _transferFrom(_from, _to, _tokenId);
        if (isContract(_to)) {
            bytes4 retval = IERC721Receiver(_to).onERC721Received(msg.sender, _from, _tokenId, _data);
            require(retval == ERC721_RECEIVED_OLD);
        }
    }

    ////////////////////////////////////////////////////////
    // ERC998ERC721 and ERC998ERC721Enumerable implementation
    ////////////////////////////////////////////////////////

    // tokenId => child contract
    mapping(uint256 => address[]) private childContracts;

    // tokenId => (child address => contract index+1)
    mapping(uint256 => mapping(address => uint256)) private childContractIndex;

    // tokenId => (child address => array of child tokens)
    mapping(uint256 => mapping(address => uint256[])) private childTokens;

    // tokenId => (child address => (child token => child index+1)
    mapping(uint256 => mapping(address => mapping(uint256 => uint256))) private childTokenIndex;

    // child address => childId => tokenId
    mapping(address => mapping(uint256 => uint256)) internal childTokenOwner;


    function removeChild(uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
        uint256 tokenIndex = childTokenIndex[_tokenId][_childContract][_childTokenId];
        require(tokenIndex != 0, "Child token not owned by token.");

        // remove child token
        uint256 lastTokenIndex = childTokens[_tokenId][_childContract].length - 1;
        uint256 lastToken = childTokens[_tokenId][_childContract][lastTokenIndex];
        if (_childTokenId == lastToken) {
            childTokens[_tokenId][_childContract][tokenIndex - 1] = lastToken;
            childTokenIndex[_tokenId][_childContract][lastToken] = tokenIndex;
        }
        childTokens[_tokenId][_childContract].length--;
        delete childTokenIndex[_tokenId][_childContract][_childTokenId];
        delete childTokenOwner[_childContract][_childTokenId];

        // remove contract
        if (lastTokenIndex == 0) {
            uint256 lastContractIndex = childContracts[_tokenId].length - 1;
            address lastContract = childContracts[_tokenId][lastContractIndex];
            if (_childContract != lastContract) {
                uint256 contractIndex = childContractIndex[_tokenId][_childContract];
                childContracts[_tokenId][contractIndex] = lastContract;
                childContractIndex[_tokenId][lastContract] = contractIndex;
            }
            childContracts[_tokenId].length--;
            delete childContractIndex[_tokenId][_childContract];
        }
    }

    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0);
        require(tokenId == _fromTokenId);
        require(_to != address(0));
        address rootOwner = address(uint256(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender);
        removeChild(tokenId, _childContract, _childTokenId);
        ERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId);
        emit TransferChild(tokenId, _to, _childContract, _childTokenId);
    }

    function safeTransferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId, bytes calldata _data) external {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0);
        require(tokenId == _fromTokenId);
        require(_to != address(0));
        address rootOwner = address(uint256(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender);
        removeChild(tokenId, _childContract, _childTokenId);
        ERC721(_childContract).safeTransferFrom(address(this), _to, _childTokenId, _data);
        emit TransferChild(tokenId, _to, _childContract, _childTokenId);
    }

    function transferChild(uint256 _fromTokenId, address _to, address _childContract, uint256 _childTokenId) external {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0);
        require(tokenId == _fromTokenId);
        require(_to != address(0));
        address rootOwner = address(uint256(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender);
        removeChild(tokenId, _childContract, _childTokenId);
        //this is here to be compatible with cryptokitties and other old contracts that require being owner and approved
        // before transferring.
        //does not work with current standard which does not allow approving self, so we must let it fail in that case.
        //0x095ea7b3 == "approve(address,uint256)"
        bytes memory callData = abi.encodeWithSelector(0x095ea7b3, this, _childTokenId);
        assembly {
            let success := call(gas, _childContract, 0, add(callData, 0x20), mload(callData), callData, 0)
        }
        ERC721(_childContract).transferFrom(address(this), _to, _childTokenId);
        /*emit TransferChild(tokenId, _to, _childContract, _childTokenId);*/
    }

    function transferChildToParent(uint256 _fromTokenId, address _toContract, uint256 _toTokenId, address _childContract, uint256 _childTokenId, bytes calldata _data) external {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        require(tokenId > 0 || childTokenIndex[tokenId][_childContract][_childTokenId] > 0);
        require(tokenId == _fromTokenId);
        require(_toContract != address(0));
        address rootOwner = address(uint256(rootOwnerOf(tokenId)));
        require(rootOwner == msg.sender || tokenOwnerToOperators[rootOwner][msg.sender] ||
        rootOwnerAndTokenIdToApprovedAddress[rootOwner][tokenId] == msg.sender);
        removeChild(_fromTokenId, _childContract, _childTokenId);
        ERC998ERC721BottomUp(_childContract).transferToParent(address(this), _toContract, _toTokenId, _childTokenId, _data);
        emit TransferChild(_fromTokenId, _toContract, _childContract, _childTokenId);
    }

    // this contract has to be approved first in _childContract
    function getChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) external {
        receiveChild(_from, _tokenId, _childContract, _childTokenId);
        require(_from == msg.sender ||
        ERC721(_childContract).isApprovedForAll(_from, msg.sender) ||
        ERC721(_childContract).getApproved(_childTokenId) == msg.sender);
        ERC721(_childContract).transferFrom(_from, address(this), _childTokenId);
    }

    function onERC721Received(address _from, uint256 _childTokenId, bytes calldata _data) external returns (bytes4) {
        require(_data.length > 0, "_data must contain the uint256 tokenId to transfer the child token to.");
        // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
        uint256 tokenId;
        assembly {tokenId := calldataload(132)}
        if (_data.length < 32) {
            tokenId = tokenId >> 256 - _data.length * 8;
        }
        receiveChild(_from, tokenId, msg.sender, _childTokenId);
        require(ERC721(msg.sender).ownerOf(_childTokenId) != address(0), "Child token not owned.");
        return ERC721_RECEIVED_OLD;
    }

    function onERC721Received(address /*_operator*/, address _from, uint256 _childTokenId, bytes calldata _data) external returns (bytes4) {
        require(_data.length > 0, "_data must contain the uint256 tokenId to transfer the child token to.");
        // convert up to 32 bytes of_data to uint256, owner nft tokenId passed as uint in bytes
        uint256 tokenId;
        assembly {tokenId := calldataload(164)}
        if (_data.length < 32) {
            tokenId = tokenId >> 256 - _data.length * 8;
        }
        receiveChild(_from, tokenId, msg.sender, _childTokenId);
        require(ERC721(msg.sender).ownerOf(_childTokenId) != address(0), "Child token not owned.");
        return ERC721_RECEIVED_NEW;
    }

    function receiveChild(address _from, uint256 _tokenId, address _childContract, uint256 _childTokenId) private {
        require(tokenIdToTokenOwner[_tokenId] != address(0), "_tokenId does not exist.");
        require(childTokenIndex[_tokenId][_childContract][_childTokenId] == 0, "Cannot receive child token because it has already been received.");
        uint256 childTokensLength = childTokens[_tokenId][_childContract].length;
        if (childTokensLength == 0) {
            childContractIndex[_tokenId][_childContract] = childContracts[_tokenId].length;
            childContracts[_tokenId].push(_childContract);
        }
        childTokens[_tokenId][_childContract].push(_childTokenId);
        childTokenIndex[_tokenId][_childContract][_childTokenId] = childTokensLength + 1;
        childTokenOwner[_childContract][_childTokenId] = _tokenId;
        emit ReceivedChild(_from, _tokenId, _childContract, _childTokenId);
    }

    function _ownerOfChild(address _childContract, uint256 _childTokenId) internal view returns (address parentTokenOwner, uint256 parentTokenId) {
        parentTokenId = childTokenOwner[_childContract][_childTokenId];
        require(parentTokenId > 0 || childTokenIndex[parentTokenId][_childContract][_childTokenId] > 0);
        return (tokenIdToTokenOwner[parentTokenId], parentTokenId);
    }

    function ownerOfChild(address _childContract, uint256 _childTokenId) external view returns (bytes32 parentTokenOwner, uint256 parentTokenId) {
        parentTokenId = childTokenOwner[_childContract][_childTokenId];
        require(parentTokenId > 0 || childTokenIndex[parentTokenId][_childContract][_childTokenId] > 0);
        return (ERC998_MAGIC_VALUE << 224 | bytes32(uint256(tokenIdToTokenOwner[parentTokenId])), parentTokenId);
    }

    function childExists(address _childContract, uint256 _childTokenId) external view returns (bool) {
        uint256 tokenId = childTokenOwner[_childContract][_childTokenId];
        return childTokenIndex[tokenId][_childContract][_childTokenId] != 0;
    }

    function totalChildContracts(uint256 _tokenId) external view returns (uint256) {
        return childContracts[_tokenId].length;
    }

    function childContractByIndex(uint256 _tokenId, uint256 _index) external view returns (address childContract) {
        require(_index < childContracts[_tokenId].length, "Contract address does not exist for this token and index.");
        return childContracts[_tokenId][_index];
    }

    function totalChildTokens(uint256 _tokenId, address _childContract) external view returns (uint256) {
        return childTokens[_tokenId][_childContract].length;
    }

    function childTokenByIndex(uint256 _tokenId, address _childContract, uint256 _index) external view returns (uint256 childTokenId) {
        require(_index < childTokens[_tokenId][_childContract].length, "Token does not own a child token at contract address and index.");
        return childTokens[_tokenId][_childContract][_index];
    }

    //------------------------------------------------------------
    // ERC721 Metadata interface

    function name() external pure returns (string memory) {
        return "Tokens Equal Text ERC-998";
    }

    function symbol() external pure returns (string memory) {
        return "TET998";
    }

    string private tokenURIBase = "https://robmyers.org/tokens-equal-text/";

    function updateTokenURIBase(string calldata _newBase) onlyOwner external {
        tokenURIBase = _newBase;
    }

    function tokenURI(uint256 _tokenId) external view returns (string memory) {
        return Strings.strConcat(
            tokenURIBase,
            Strings.uint2str(_tokenId)
        );
    }

    //------------------------------------------------------------

    // wrapper on minting new 721
    // NO MINTING outside of initial batch minting
    function _mint(address _to) private returns (uint256) {
        tokenCount++;
        uint256 tokenCount_ = tokenCount;
        tokenIdToTokenOwner[tokenCount_] = _to;
        tokenOwnerToTokenCount[_to]++;
        return tokenCount_;
    }

    function mintBatch(uint256 _count) onlyOwner public {
        for(uint256 i = 0; i < _count; i++) {
            // msg.sender will be owner, saving a call to owner()
            _mint(msg.sender);
        }
    }

}
