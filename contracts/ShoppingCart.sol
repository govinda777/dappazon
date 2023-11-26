// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IItem {
    struct model {
        uint256 id;
        uint256 cost;
        uint256 quantity;
    }
}

interface IShoppingCart {
    
    function create(IItem.model[] memory _items) external;
    function read(uint256 _id) external view returns (IItem.model[] memory);
}

contract ShoppingCart is IShoppingCart {

    address public owner;
    
    mapping(address => mapping(uint256 => mapping(uint256 => IItem.model))) private _shoppingCarts;
    mapping(address => uint256) public shoppingCartCount;
    //itemCount
    mapping(address => mapping(uint256 => uint256)) public itemCount;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function create(IItem.model[] memory _items) public override {
        shoppingCartCount[msg.sender]++;
        for (uint256 i = 0; i < _items.length; i++) {
            _shoppingCarts[msg.sender][shoppingCartCount[msg.sender]][i] = _items[i];
        }
        itemCount[msg.sender][shoppingCartCount[msg.sender]] = _items.length;
    }

    function read(uint256 _id) public view override returns (IItem.model[] memory) {
        
        IItem.model[] memory items = new IItem.model[](itemCount[msg.sender][_id]);
        for (uint256 i = 0; i < itemCount[msg.sender][_id]; i++) {
            items[i] = _shoppingCarts[msg.sender][_id][i];
        }
        return items;
    }

}