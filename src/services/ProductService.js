import { ethers } from 'ethers'
import ProductSC from '../abis/contracts/Product.sol/Product.json'
import { client } from '../lib/sanity'
import { ProductRepository } from '../repositories/ProductRepository'

export class ProductService {
    
    constructor(productAddress, provider) {
        
        this.product = new ethers.Contract(productAddress, ProductSC.abi, provider);
        this.productRepository = new ProductRepository(client);
    }

    // TODO : Implementar paginacao
    async readAll() {
        const products = await this.product.readAll();
        const productsCms = await this.productRepository.readAll();
        
        const result = []

        for (const product of products) {
            const productDetails = await this.product.read(product);
            result.push({
                ...productDetails,
                ...productsCms.find(
                    (productCms) => parseInt(productCms.id,10) === product.toNumber())
            })
        }
        console.log(result);
        return result;
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