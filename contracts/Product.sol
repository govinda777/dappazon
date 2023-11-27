// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ShoppingCart.sol";

interface IProduct {

    //Model
    struct model {
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    //Events
    event ProductCreated(uint256 id, IProduct.model product);
    event ProductUpdated(uint256 id, IProduct.model product);
    event ProductUpdateStock(IItem.model[] shoppingCartProducts);
    event ProductDeleted(uint256 id);

    //Functions
    function create(IProduct.model memory _product) external returns (uint256);
    function read(uint256 _id) external view returns (IProduct.model memory);
    function update(uint256 _id, IProduct.model memory _product) external;
    function updateStock(IItem.model[] memory _shoppingCartProducts) external;
    function del(uint256 _id) external;
}

contract Product is IProduct {
    address public owner;
    mapping(uint256 => IProduct.model) private _products;
    mapping(address => uint256) public productsCount;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function create(
        IProduct.model memory _product
    ) external override onlyOwner returns (uint256) {

        productsCount[msg.sender]++;
        _products[productsCount[msg.sender]] = _product;

        uint256 productId = productsCount[msg.sender];

        emit ProductCreated(productId, _product);

        return productId;
    }

    function read(
        uint256 _id
    ) public view override returns (IProduct.model memory) {
        return _products[_id];
    }

    function update(
        uint256 _id,
        IProduct.model memory _product
    ) public override onlyOwner {
        _products[_id] = _product;
        emit ProductUpdated(_id, _product);
    }

    function updateStock(
        IItem.model[] memory _shoppingCartProducts
    ) external onlyOwner {
        for (uint256 i = 0; i < _shoppingCartProducts.length; i++) {
            uint256 produtcId = _shoppingCartProducts[i].produtcId;
            IProduct.model memory productInfo = read(produtcId);

            productInfo.stock =
                productInfo.stock -
                _shoppingCartProducts[i].quantity;

            update(produtcId, productInfo);
        }

        emit ProductUpdateStock(_shoppingCartProducts);
    }

    function del(uint256 _id) public override onlyOwner {
        delete _products[_id];
        emit ProductDeleted(_id);
    }


}