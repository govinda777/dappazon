// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";
import "./Order.sol";

contract Dappazon {

    address public owner;
    IProduct public product;
    IOrder public order;
    IShoppingCart public shoppingCart;

    event Buy(address buyer, uint256 orderId, uint256[] productIds);
    
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor(address _productAddress,
                address _orderAddress) {

        owner = msg.sender;
        product = Product(_productAddress);
        order = Order(_orderAddress);
    }
    
    //0x17eDfB8a794ec4f13190401EF7aF1c17f3cc90c5
    function buy(address _user, uint256 _shoppingCartId) public payable returns (uint256) {

        IShoppingCart.model memory _shoppingCartInfo = shoppingCart.read(_user, _shoppingCartId);
        IItem.model[] memory _shoppingCartProducts = shoppingCart.readProducts(_user, _shoppingCartId);
        uint256[] memory _productIds = new uint256[](_shoppingCartProducts.length);
        
        require(_shoppingCartInfo.id != 0, "_shoppingCartInfo is not defined");
        require(_shoppingCartProducts.length > 0, "Shopping cart is empty");
        require(_shoppingCartInfo.totalCost <= msg.value, "Insufficient funds");

        //Validacao
        for (uint256 i = 0; i < _shoppingCartProducts.length; i++) {
            
            IItem.model memory item = _shoppingCartProducts[i];
            
            _productIds[i] = item.productId;

            IProduct.model memory productData = product.read(item.productId);
            
            require(productData.stock >= item.quantity , "Insufficient stock");
            
            require(product.updateStock(item), "Update stock failed");
        }
        
        uint256 orderId = order.create(_user, _shoppingCartId, _productIds);

        emit Buy(_user, orderId, _productIds);

        return orderId;
    }

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}

