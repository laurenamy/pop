// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ItemToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    mapping(address => uint256) public userToken;

    constructor() ERC721("GameItem", "ITM") {}

    function mintItem(string memory tokenUri)
        public
    {
        _tokenIds.increment();

        uint256 newId = _tokenIds.current();
        userToken[msg.sender] = newId;
        _safeMint(msg.sender, newId);
        _setTokenURI(newId, tokenUri);
    }

    function transfer(address newOwner) public {
        uint256 id = userToken[msg.sender];
        safeTransferFrom(msg.sender, newOwner, id);
        delete userToken[msg.sender];
        userToken[newOwner] = id;
    }
}
