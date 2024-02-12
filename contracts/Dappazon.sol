// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Product.sol";

contract Dappazon {

    address public owner;
    IProduct public product;

    event PurchaseMade(address buyer, uint256[] products, uint256[] quantities);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _productAddress) {

        owner = msg.sender;
        product = Product(_productAddress);
    }
    
    function buy(uint256[] memory productIds, uint256[] memory quantities) public payable returns (bool) {

        require(productIds.length == quantities.length, "Product IDs and quantities length mismatch");
        require(productIds.length > 0, "No products specified");

        uint256 totalCost = 0;

        for (uint256 i = 0; i < productIds.length; i++) {
            IProduct.model memory productData = product.read(productIds[i]);
            require(productData.stock >= quantities[i], "Insufficient stock");
            totalCost += productData.cost * quantities[i];
        }

        require(totalCost <= msg.value, "Insufficient funds");

        for (uint256 i = 0; i < productIds.length; i++) {
            require(product.updateStock(productIds[i], quantities[i]), "Update stock failed");
        }

        emit PurchaseMade(msg.sender, productIds, quantities);

        return true;
    }


    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}

