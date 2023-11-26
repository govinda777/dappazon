// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";
import "./ShoppingCart.sol";

interface IOrder {

    struct model 
    {
        uint256 shoppingCartId;
    }

    //function create(IOrder.model memory _order, IProduct.model[] memory _products) external returns (uint256);
    function read(uint256 _id) external view returns (IOrder.model memory);
    function update(uint256 _id, IOrder.model memory _order) external;
}

contract Order is IOrder {

    address public owner;
    mapping(address => mapping(uint256 => IOrder.model)) private _orders;
    mapping(address => mapping(uint256 => uint256[])) private _ordersProducts;
    mapping(address => uint256) public orderCount;
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function create(IOrder.model memory _order, uint256[] memory _productsIds) public returns (uint256) {
        orderCount[msg.sender]++;
        _orders[msg.sender][orderCount[msg.sender]] = _order;
        _ordersProducts[msg.sender][orderCount[msg.sender]] = _productsIds;
        return orderCount[msg.sender];
    }

    function read(uint256 _id) public view returns (IOrder.model memory) {
        return _orders[msg.sender][_id];
    }

    function update(uint256 _id, IOrder.model memory _order) public {
        _orders[msg.sender][_id] = _order;
    }
}