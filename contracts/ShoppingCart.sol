// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "./Product.sol";

interface IItem {
    
    struct model {
        uint256 productId;
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

    //Events
    event ShoppingCartCreated(uint256 id, IShoppingCart.model shoppingCartInfo);
    event ShoppingCartAddProduct(uint256 id, IShoppingCart.model shoppingCartInfo, IItem.model[] itemsInfo);
    event ShoppingCartRemovedProduct(uint256 shoppingCartId, uint256 productId, uint256 quantity);

    //Functions
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
        IProduct.model memory productInfo = product.read(_productId);

        require(productInfo.stock >= _quantity, "Not enough stock");

        IItem.model memory item;
        item.productId = _productId;
        item.cost = productInfo.cost;
        item.rating = productInfo.rating;
        item.quantity = _quantity;

        _shoppingCarts[msg.sender][_shoppingCartsId].total_cost += item.cost * _quantity;

        _shoppingCartsProducts[msg.sender][_shoppingCartsId].push(item);

        emit ShoppingCartAddProduct(
            _shoppingCartsId,
            _shoppingCarts[msg.sender][_shoppingCartsId],
            _shoppingCartsProducts[msg.sender][_shoppingCartsId]
        );
    }

    function removeProduct(uint256 _shoppingCartId, uint256 _productId, uint256 _quantity) public {
        require(_quantity > 0, "Quantity must be greater than zero");
        
        IItem.model[] storage items = _shoppingCartsProducts[msg.sender][_shoppingCartId];
        bool itemFound = false;
        
        for (uint256 i = 0; i < items.length; i++) {
            if (items[i].productId == _productId) {
                itemFound = true;
                require(items[i].quantity >= _quantity, "Not enough item quantity");

                // Atualiza o custo total do carrinho de compras
                _shoppingCarts[msg.sender][_shoppingCartId].total_cost -= items[i].cost * _quantity;

                if (items[i].quantity == _quantity) {
                    // Se a quantidade a ser removida é igual à quantidade do item, remova o item do array
                    removeItemAtIndex(items, i);
                } else {
                    // Caso contrário, apenas diminua a quantidade
                    items[i].quantity -= _quantity;
                }
                break;
            }
        }

        require(itemFound, "Item not found in the shopping cart");

        // Emitir evento de item removido (opcional)
        emit ShoppingCartRemovedProduct(_shoppingCartId, _productId, _quantity);
    }

function removeItemAtIndex(IItem.model[] storage items, uint256 index) internal {
    require(index < items.length, "Index out of bounds");

    // Move o último item para o local do item a ser removido
    items[index] = items[items.length - 1];

    // Remove o último item, agora duplicado
    items.pop();
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

                productId: products[i].productId,
                cost: products[i].cost,
                rating: products[i].rating,
                quantity: products[i].quantity
            });

            convertedProducts[i] = element;
        }
        
        return convertedProducts;
    }
    
}
