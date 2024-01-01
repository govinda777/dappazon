export class ShoppingCartRepository {

    constructor(client) {
        this.client = client;
    }

    //Get the next and if not exist create a new 
    //Calc total 
    // Total cust
    // Total cupos
    // Total products
    // Total InEth
    // Total InUsd
    // Total InBrl
    // Total InBtc
    async get(account) {

        const shoppingCart = await this.client.fetch(`
          *[_type == "shoppingCart" && account == $account]{
            id,
            products[]->{
              _id,
              cost,
              quantity
            },
            cupons,
            "totalCost": sum(products[]->(cost * quantity)) - coalesce(sum(cupons[]->discount), 0)
          }`, { account });
        
        console.log(shoppingCart);

        return shoppingCart;
    }

    //Save new shopping cart with products and cupons
    create(account, productsId, cuponsId) {
        const shoppingCart = {
            _type: 'shoppingCart',
            account,
            productsId,
            cuponsId
        };
        
        const shoppingCartId = this.client.create(shoppingCart);
        return shoppingCartId;
    }

    addProduct(account, productId, quantity) {
        
        const shoppingCart = this.get(account);
        const product = {
            _type: 'product',
            productId,
            quantity
        };

        this.client.update(shoppingCart._id, {
            set: {
                products: [
                    ...shoppingCart.products,
                    product
                ]
            }
        });

        const shoppingCartId = this.client.create(product);
        return shoppingCartId;
    }
}