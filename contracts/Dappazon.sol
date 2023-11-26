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
/*
    function getProductIds(IItem.model[] memory items) internal pure returns (uint256[] memory) {

        uint256[] memory _ids = new uint256[](items.length);
        
        for (uint256 i = 0; i < items.length; i++) {
            _ids[i] = items[i].id;
        }

        return _ids;
    }
*/
    function buy(uint256 shoppingCartId) public payable {
        //Get shopping cart
        IItem.model[] memory _shoppingCartInfo = shoppingCart.read(shoppingCartId);
        // Fetch item
        /*
        uint256[] memory _produtcsId = getProductIds(_shoppingCartInfo.items);

        
        IProduct.model[] memory productsInfo = product.read(_produtcsId);
        
        validateShoppingCart(_shoppingCartInfo, productsInfo);

        // Create order
        uint256 orderId = order.create(IOrder.model({
            time: block.timestamp,
            productsInfo: productsInfo,
            shoppingCartInfo: _shoppingCartInfo
        }));
        
        // Add order for user
        product.updateStock(productsInfo);

        // Emit event
        emit Buy(msg.sender, orderId , _produtcsId);
        */
    }
/*
    function validateShoppingCart(IShoppingCart.model memory _shoppingCartInfo, IProduct.model[] memory productsInfo) internal {

        require(_shoppingCartInfo.items.length == productsInfo.length, "Shopping cart and products length must be equal");
        
        uint256 totalCost = 0;

        for (uint256 i = 0; i < _shoppingCartInfo.items.length; i++) {
            
            totalCost += _shoppingCartInfo.items[i].cost * _shoppingCartInfo.items[i].quantity;

            require(productsInfo[i].stock >= _shoppingCartInfo.items[i].quantity, "Insufficient stock");
        }

        require(msg.value >= totalCost);
    }
*/
    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
