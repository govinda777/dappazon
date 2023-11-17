// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";
import "./Order.sol";

contract Dappazon {

    address public owner;
    IProduct.product public product;
    Product public productContract;
    IOrder.order public order;

    mapping(address => mapping(uint256 => IOrder.order)) public orders;
    mapping(address => uint256) public orderCount;

    event Buy(address buyer, uint256 orderId, uint256 itemId);
    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _productAddress) {
        owner = msg.sender;
        productContract = Product(_productAddress);
    }

    function buy(uint256 _id) public payable {
        // Fetch item
        product.ProductInfo memory product = productContract.read(_id);
        
        require(msg.value >= product.cost);
        require(product.stock > 0);

        // Create order
        Order memory order = Order(block.timestamp, item);

        // Add order for user
        orderCount[msg.sender]++; // <-- Order ID
        orders[msg.sender][orderCount[msg.sender]] = order;

        product.stock = product.stock - 1;
        productContract.update(_id, product);

        // Emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
