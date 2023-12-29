import { ethers } from 'ethers'
import ProductSC from '../abis/contracts/Product.sol/Product.json'
import { client } from '../lib/sanity'
import { ProductRepository } from '../repositories/ProductRepository'

// class CRUD to contract Product 
export class ProductService {
    
    constructor(productAddress, provider) {
        
        this.product = new ethers.Contract(productAddress, ProductSC.abi, provider);
        this.productRepository = new ProductRepository(client);
    }

    async readAll() {
        console.log('>readAll');
        const products = await this.product.readAll();

        console.log('>products', products);

        const productsCms = await this.productRepository.readAll();
        console.log('>productsCms', productsCms);
        
        const response = products.map((product) => {
            const productCms = productsCms.find((productCms) => productCms._id === product.id);
            return {
                ...product,
                ...productCms,
            };
        });

        console.log('>response', response);

        return response;
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