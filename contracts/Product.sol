// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface IProduct {

    //Model
    struct model {
        uint256 id;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    //Events
    event ProductCreated(uint256 id, IProduct.model product);
    event ProductUpdated(uint256 id, IProduct.model product);
    event ProductUpdateStock(uint256 id, IProduct.model product);
    event ProductDeleted(uint256 id);

    //Functions
    function create(IProduct.model memory _product) external;
    function read(uint256 _id) external view returns (IProduct.model memory);
    //function read(uint256[] memory _ids) external view returns (IProduct.model[] memory);
    function update(uint256 _id, IProduct.model memory _product) external;
    //function updateStock(IProduct.model[] memory _updatedProducts) external;
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

    function create(IProduct.model memory _product) public override onlyOwner {
        productsCount[msg.sender]++;
        _products[1 + productsCount[msg.sender]] = _product;
        emit ProductCreated(_product.id, _product);
    }

    function read(
        uint256 _id
    ) public view override returns (IProduct.model memory) {
        return _products[_id];
    }
/*
    function read(
        uint256[] memory _ids
    ) external view override returns (IProduct.model[] memory) {
        IProduct.model[] memory products = new IProduct.model[](_ids.length);
        for (uint256 i = 0; i < _ids.length; i++) {
            if (_products[_ids[i]].stock > 0) {
                products[i] = _products[_ids[i]];
            }

            //products[i] = _products[_ids[i]];
        }
        return products;
    }
*/
    function update(
        uint256 _id,
        IProduct.model memory _product
    ) public override onlyOwner {
        _products[_id] = _product;
        emit ProductUpdated(_id, _product);
    }
/*
    function updateStock(IProduct.model[] memory _updatedProducts) 
    external onlyOwner {
        
        for (uint256 i = 0; i < _updatedProducts.length; i++) {
            
            uint256 id = _updatedProducts[i].id;
            IProduct.model memory productInfo = read(id);
            
            productInfo.stock--;
            
            update(id, productInfo);

            emit ProductUpdateStock(id, productInfo);
        }
    }
    */

    function del(uint256 _id) public override onlyOwner {
        delete _products[_id];
        emit ProductDeleted(_id);
    }
}