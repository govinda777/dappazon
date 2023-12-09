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

    function create(address _user, uint256 _shoppingCartId, uint256[] memory _products) external returns (uint256);
    function read(address _user, uint256 _id) external view returns (IOrder.model memory);
    function readProducts(address _user, uint256 _orderId) external view returns (uint256[] memory);
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

    function create(address _user, uint256 _shoppingCartId, uint256[] memory _productsIds) public returns (uint256) {
        
        orderCount[_user]++;

        uint256 orderId = orderCount[_user];

        _orders[_user][orderId] = IOrder.model(_shoppingCartId);
        
        _ordersProducts[_user][orderId] = _productsIds;

        emit OrderCreated(_user, orderId, _productsIds);

        return orderId;
    }

    function read(address _user, uint256 _id) public view returns (IOrder.model memory) {
        return _orders[_user][_id];
    }

    function readProducts(address _user, uint256 _orderId) public view returns (uint256[] memory) {
        return _ordersProducts[_user][_orderId];
    }
}