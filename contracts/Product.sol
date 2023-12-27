// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./ShoppingCart.sol";

interface IProduct {
    struct model {
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    event ProductCreated(uint256 id, IProduct.model product);
    event ProductUpdated(uint256 id, IProduct.model product);
    event ProductUpdateStock(uint256 stock, IItem.model shoppingCartProducts);
    event ProductDeleted(uint256 id);

    function create(IProduct.model memory _product) external returns (uint256);
    function read(uint256 _id) external view returns (IProduct.model memory);
    function readAll() external view returns (uint256[] memory);
    function update(uint256 _id, IProduct.model memory _product) external;
    function updateStock(IItem.model memory _shoppingCartProducts) external returns (bool);
    function del(uint256 _id) external;
}

contract Product is IProduct {
    address public owner;
    mapping(uint256 => IProduct.model) private _products;
    uint256 private _productCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function create(IProduct.model memory _product) external override onlyOwner returns (uint256) {
        _productCount++;
        _products[_productCount] = _product;
        emit ProductCreated(_productCount, _product);
        return _productCount;
    }

    function readAll() public view returns (uint256[] memory) {
        uint256[] memory productIds = new uint256[](_productCount);
        for (uint256 i = 1; i <= _productCount; i++) {
            productIds[i - 1] = i;
        }
        return productIds;
    }

    function read(uint256 _id) public view override returns (IProduct.model memory) {
        require(_id <= _productCount, "Product does not exist");
        return _products[_id];
    }

    function update(uint256 _id, IProduct.model memory _product) public override onlyOwner {
        require(_id <= _productCount, "Product does not exist");
        _products[_id] = _product;
        emit ProductUpdated(_id, _product);
    }

    function updateStock(IItem.model memory _shoppingCartProduct) external override returns (bool) {
        uint256 productId = _shoppingCartProduct.productId;
        require(productId <= _productCount, "Product does not exist");

        IProduct.model storage productInfo = _products[productId];
        require(productInfo.stock >= _shoppingCartProduct.quantity, "Insufficient stock");
        
        productInfo.stock -= _shoppingCartProduct.quantity;
        emit ProductUpdateStock(productInfo.stock, _shoppingCartProduct);
        return true;
    }

    function del(uint256 _id) public override onlyOwner {
        require(_id <= _productCount, "Product does not exist");
        delete _products[_id];
        emit ProductDeleted(_id);
    }
}
