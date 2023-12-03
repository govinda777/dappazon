// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";
import "./Order.sol";
import "./ShoppingCart.sol";

contract Dappazon {

    address public owner;
    IProduct public product;
    IOrder public order;
    IShoppingCart public shoppingCart;

    event Buy(address buyer, uint256 orderId, uint256[] productIds);
    event List(string name, uint256 cost, uint256 quantity);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _productAddress, 
                address _orderAddress,
                address _shoppingCartAddress) {

        owner = msg.sender;
        product = Product(_productAddress);
        order = Order(_orderAddress);
        shoppingCart = ShoppingCart(_shoppingCartAddress);
    }

    function buy(uint256 shoppingCartId) public payable returns (uint256) {
        /*
        //Get shopping cart
        IShoppingCart.model memory _shoppingCartInfo = shoppingCart.read(shoppingCartId);
        IItem.model[] memory _shoppingCartProducts = shoppingCart.readProducts(shoppingCartId);
        uint256[] memory _produtcsId;

        require(_shoppingCartInfo.totalCost <= msg.value, "Insufficient funds");

        //Check if products are in stock
        for (uint256 i = 0; i < _shoppingCartProducts.length; i++) {
            
            _produtcsId[i] = _shoppingCartProducts[i].productId;
            
            require(product.read(_produtcsId[i]).stock >= _shoppingCartProducts[i].quantity, "Insufficient stock");
        }
        
        uint256 orderId = order.create(shoppingCartId, _produtcsId);

        // Add order for user
        product.updateStock(_shoppingCartProducts);

        return orderId;
        */
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
