// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Roles.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

interface IProduct {

    //Model
    struct ProductInfo {
        uint256 id;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    //Events
    event ProductCreated(uint256 id, IProduct.product product);
    event ProductUpdated(uint256 id, IProduct.product product);
    event ProductDeleted(uint256 id);

    //Functions
    function create(ProductInfo memory _product) external;
    function read(uint256 _id) external view returns (ProductInfo memory);
    function update(uint256 _id, ProductInfo memory _product) external;
    function del(uint256 _id) external;
}

contract Product is IProduct {

    using Roles for Roles.Role;

    Roles.Role private _admins;
    Roles.Role private _writes;

    mapping(uint256 => ProductInfo) private _products;

    constructor() {
        _admins.add(msg.sender);
    }

    modifier onlyAdmin() {
        require(_admins.has(msg.sender), "Product: only admin");
        _;
    }

    modifier onlyWrite() {
        require(_writes.has(msg.sender), "Product: only write");
        _;
    }
    
    function create(ProductInfo memory _product) public override onlyAdmin onlyWrite {
        _products[1 + _product.length] = _product;
        emit ProductCreated(_product.id, _product);
    }

    function read(uint256 _id) public view override returns (ProductInfo memory) {
        return _products[_id];
    }

    function update(uint256 _id, ProductInfo memory _product) public override onlyAdmin onlyWrite {
        _products[_id] = _product;
        emit ProductUpdated(_id, _product);
    }

    function del(uint256 _id) public override onlyAdmin {
        delete _products[_id];
        emit ProductDeleted(_id);
    }
}