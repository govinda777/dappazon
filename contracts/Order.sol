// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";

interface IOrder {

    struct order 
    {
        uint256 time;
        IProduct.product[] product;
    }


}