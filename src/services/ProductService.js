import { ethers } from 'ethers'
import ProductSC from '../abis/contracts/Product.sol/Product.json'

// class CRUD to contract Product 
export class ProductService {
    
    constructor(productAddress, provider) {
        
        this.product = new ethers.Contract(productAddress, ProductSC.abi, provider);
    }

    async readAll() {
        
        const products = await this.product.readAll();
        const productsDetails = products.map(async (product) => {
            await this.product.read(product.id) 
        });

        return productsDetails;
    }
    
    async read(id) {
        const product = await this.product.read(id);
        return product;
    }
    
    async create(name, description, price, image) {
        const product = await this.product.create(name, description, price, image);
        return product;
    }
    
    async update(id, name, description, price, image) {
        const product = await this.product.update(id, name, description, price, image);
        return product;
    }
    
    async delete(id) {
        const product = await this.product.delete(id);
        return product;
    }
}