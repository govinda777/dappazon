// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";

interface IItem {
    
    struct model {
        uint256 produtcId;
        uint256 cost;
        uint256 rating;
        uint256 quantity;
    }
}

interface IShoppingCart {
    struct model {
        uint256 id;
        uint256 total_cost;
    }

    function create(
        IShoppingCart.model memory _shoppingCart
    ) external returns (uint256);

    function addProduct(
        uint256 _shoppingCartsId,
        uint256 _productId,
        uint256 _quantity
    ) external;

    function read(uint256 _id) external view returns (IShoppingCart.model memory);

    function readProducts(
        uint256 _shoppingCartsId
    ) external view returns (IItem.model[] memory);

}

contract ShoppingCart is IShoppingCart {
    address public owner;

    mapping(address => mapping(uint256 => IShoppingCart.model))
        private _shoppingCarts;
    mapping(address => mapping(uint256 => IItem.model[]))
        private _shoppingCartsProducts;
    mapping(address => uint256) public shoppingCartsCount;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    IProduct public product;

    constructor(address _productAddress) {
        owner = msg.sender;
        product = Product(_productAddress);
    }

    //Create a new shopping cart and return shopping_cart_id
    function create(
        IShoppingCart.model memory _shoppingCart
    ) public returns (uint256) {
        //new shopping cart
        shoppingCartsCount[msg.sender]++;
        _shoppingCarts[msg.sender][
            shoppingCartsCount[msg.sender]
        ] = _shoppingCart;

        uint256 shoppingCartId = shoppingCartsCount[msg.sender];

        return shoppingCartId;
    }

    function addProduct(
        uint256 _shoppingCartsId,
        uint256 _productId,
        uint256 _quantity
    ) public {
        IProduct.model memory productInfo;
        productInfo = product.read(_productId);

        require(productInfo.stock >= _quantity, "Not enough stock");

        IItem.model memory item;
        item.produtcId = _productId;
        item.cost = productInfo.cost;
        item.rating = productInfo.rating;
        item.quantity = _quantity;

        _shoppingCartsProducts[msg.sender][_shoppingCartsId].push(item);
    }

    function read(
        uint256 _id
    ) public view returns (IShoppingCart.model memory) {
        return _shoppingCarts[msg.sender][_id];
    }

    
    function readProducts(uint256 _shoppingCartsId) public view returns (IItem.model[] memory) {
        
        IItem.model[] memory products = _shoppingCartsProducts[msg.sender][_shoppingCartsId];
        
        IItem.model[] memory convertedProducts = new IItem.model[](products.length);
        
        for (uint256 i = 0; i < products.length; i++) {

            IItem.model memory element = IItem.model({

                produtcId: products[i].produtcId,
                cost: products[i].cost,
                rating: products[i].rating,
                quantity: products[i].quantity
            });

            convertedProducts[i] = element;
        }
        
        return convertedProducts;
    }
    
}
