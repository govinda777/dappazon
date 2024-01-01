
import { client } from '../lib/sanity'
import { ShoppingCartRepository } from '../repositories/ShoppingCartRepository.js'

export class ShoppingCartService {

    constructor() {

        this.repository = new ShoppingCartRepository(client);
    }

    async get(account) {
        const shoppingCart = await this.repository.get(account);
        return shoppingCart;
    }

    create(account, productsId, cuponsId) {
        this.repository.get(account).then((shoppingCart) => {
            if (shoppingCart) {
                return shoppingCart;
            } else {
                return this.repository.create(account, productsId, cuponsId);
            }
        });
    }

    async addProduct(account, productId, quantity) {

        await this.shoppingCart.addProduct(account, productId, quantity);
    }

}