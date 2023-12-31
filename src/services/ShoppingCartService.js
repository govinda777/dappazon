import { ethers } from 'ethers'
import ShoppingCartSC from '../abis/contracts/ShoppingCart.sol/ShoppingCart.json'

export class ShoppingCartService {

    constructor(shoppingCartAddress, provider, signer) {

        this.shoppingCart = new ethers.Contract(shoppingCartAddress, ShoppingCartSC.abi, provider);
    }

    async read(account, shoppingCartId) {

        const shoppingCart = await this.shoppingCart.read(account, shoppingCartId);

        const products = await this.shoppingCart.readProducts(account, shoppingCartId);

        return {
            shoppingCart,
            products
        };
    }

    async create(account) {
        const shoppingCartId = await this.shoppingCart.create(account);
        return shoppingCartId;
    }

    async addItem(account, shoppingCartId, productId, quantity) {
        await this.shoppingCart.addItem(account, shoppingCartId, productId, quantity);
    }

}