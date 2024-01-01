Me ajude a criar um diagrama em mermaid:

class Dappazon{
    //Blockchain
    constructor(address _productAddress,
                address _orderAddress,
                address _shoppingCartAddress) {

        owner = msg.sender;
        product = Product(_productAddress);
        order = Order(_orderAddress);
        shoppingCart = ShoppingCart(_shoppingCartAddress);
    }

    address public owner;
    IProduct public product;
    IOrder public order;
    IShoppingCart public shoppingCart;

    event Buy(address buyer, uint256 orderId, uint256[] productIds);

    function withdraw() public onlyOwner;

    //Sanity
    +image image
    +address address // O FE irá ler essa informacao para se conectar ao Smart Contract
    +string name
}

class Product{

//Blockchain
+uint256 id;
+address sellerId;
+uint256 cost;
+uint256 rating;
+uint256 stock;

//Event
event ProductCreated(uint256 id, IProduct.model product);
event ProductUpdated(uint256 id, IProduct.model product);
event ProductUpdateStock(uint256 stock, IItem.model shoppingCartProducts);
event ProductDeleted(uint256 id);

//Methods: Blockchain
function create(IProduct.model memory _product) external returns (uint256);
function read(uint256 _id) external view returns (IProduct.model memory);
function readAll() external view returns (uint256[] memory);
function update(uint256 _id, IProduct.model memory _product) external;
function updateStock(IItem.model memory _shoppingCartProducts) external returns (bool);
function del(uint256 _id) external;

//Sanity
+string type
+string id
+string name
+string category
+string category
+string sellerId
+string description
+image image
+datetime creationDate
+datetime updateDate

}

class Seller{

//Blockchain
+address address;
+uint256 totalSales;
+uint256 totalProducts;
+uint256 totalOrders;
+uint256 totalShoppingCarts;
+uint256 totalReviews;

//Methods: Blockchain
function create(ISeller.model memory _seller) external returns (uint256);
function update(uint256 _id, ISeller.model memory _product) external;
function read(uint256 _id) external view returns (ISeller.model memory);
function readAll() external view returns (uint256[] memory);

//Event: Blockchain
event SellerCreated(uint256 id, ISeller.model seller);
event SellerUpdated(uint256 id, ISeller.model seller);

//Sanity
+string type
+string id //Mesmo id da blockchain
+string name
+string description
+image image

}

class Order{

//Blockchain


}

----

```mermaid
classDiagram
    class Dappazon {
        //Blockchain
        address owner
        IProduct product
        IOrder order
        IShoppingCart shoppingCart
        event Buy(address, uint256, uint256[])
        function withdraw() public onlyOwner
        //Sanity
        +image image
        +address address
        +string name
    }

    class Product {
        <<Blockchain>>
        +uint256 id
        +address sellerId
        +uint256 cost
        +uint256 rating
        +uint256 stock
        event ProductCreated(uint256, IProduct.model)
        event ProductUpdated(uint256, IProduct.model)
        event ProductUpdateStock(uint256, IItem.model)
        event ProductDeleted(uint256)
        function create(IProduct.model) external returns (uint256)
        function read(uint256) external view returns (IProduct.model)
        function readAll() external view returns (uint256[])
        function update(uint256, IProduct.model) external
        function updateStock(IItem.model) external returns (bool)
        function del(uint256) external
        <<Sanity>>
        +string type
        +string id
        +string name
        +string category
        +string sellerId
        +string description
        +image image
        +datetime creationDate
        +datetime updateDate
    }

    class Seller {
        <<Blockchain>>
        +address address
        +uint256 totalSales
        +uint256 totalProducts
        +uint256 totalOrders
        +uint256 totalShoppingCarts
        +uint256 totalReviews
        function create(ISeller.model) external returns (uint256)
        function update(uint256, ISeller.model) external
        function read(uint256) external view returns (ISeller.model)
        function readAll() external view returns (uint256[])
        event SellerCreated(uint256, ISeller.model)
        event SellerUpdated(uint256, ISeller.model)
        <<Sanity>>
        +string type
        +string id
        +string name
        +string description
        +image image
    }

    class Order {
        <<Blockchain>>
        +uint256 id
        +address buyerId
        +uint256[] productIds
        +uint256 totalCost
        +datetime orderDate
        function create(IOrder.model) external returns (uint256)
        function read(uint256) external view returns (IOrder.model)
        // Outros métodos e eventos específicos
    }

    class ShoppingCart {
        <<Blockchain>>
        +uint256 id
        +address userId
        +uint256[] productIds
        +uint256 totalCost
        function addProduct(uint256) external
        function removeProduct(uint256) external
        function clearCart() external
        // Outros métodos e eventos específicos
    }

    Dappazon --> Product : uses
    Dappazon --> Seller : uses
    Dappazon --> Order : uses
    Dappazon --> ShoppingCart : uses
    Product --> Seller : linked to
    Order --> Product : contains
    ShoppingCart --> Product : contains

```