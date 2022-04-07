// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract ItemToken is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("GameItem", "ITM") {}

    function mintItem(address player, string memory tokenUri)
        public
        returns (uint256 newId)
    {
        _tokenIds.increment();

        newId = _tokenIds.current();
        _mint(player, newId);
        _setTokenURI(newId, tokenUri);
    }
}
