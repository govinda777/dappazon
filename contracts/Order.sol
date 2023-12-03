// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";
import "./ShoppingCart.sol";

interface IOrder {

    struct model 
    {
        uint256 shoppingCartId;
    }

    event OrderCreated(address buyer, uint256 orderId, uint256[] productIds);

    function create(uint256 _shoppingCartId, uint256[] memory _products) external returns (uint256);
    function read(uint256 _id) external view returns (IOrder.model memory);
    function readProducts(uint256 _orderId) external view returns (uint256[] memory);
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

    function create(uint256 _shoppingCartId, uint256[] memory _productsIds) public returns (uint256) {
        
        orderCount[msg.sender]++;

        uint256 orderId = orderCount[msg.sender];

        _orders[msg.sender][orderId] = IOrder.model(_shoppingCartId);
        
        _ordersProducts[msg.sender][orderId] = _productsIds;

        emit OrderCreated(msg.sender, orderId, _productsIds);

        return orderId;
    }

    function read(uint256 _id) public view returns (IOrder.model memory) {
        return _orders[msg.sender][_id];
    }

    function readProducts(uint256 _orderId) public view returns (uint256[] memory) {
        return _ordersProducts[msg.sender][_orderId];
    }
}