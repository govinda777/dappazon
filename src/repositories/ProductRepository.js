

export class ProductRepository {

    constructor(client) {
        this.client = client;
    }

    async readAll() {
        const products = await this.client.fetch(`*[_type == "product"]{
            id,
            name,
            description,
            "image": image.asset->url
        }`);
        return products;
    }

    async read(id) {
        const product = await this.client.fetch('*[_type == "product" && _id == $id]', { id });
        return product;
    }
}
