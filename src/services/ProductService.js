import ProductRepository from '../repository/ProductRepository.js';
import ProductDTO from '../dto/ProductDTO.js';

export default class ProductService {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async getAllProducts(query, options) {
        const products = await this.productRepository.findAll(query, options);
        return products.docs.map(product => new ProductDTO(product));
    }

    async createProduct(data) {
        const product = await this.productRepository.createProduct(data);
        return new ProductDTO(product);
    }
    
    async updateProduct(id, updates) {
        return await this.productRepository.updateProduct(id, updates);
    }

    async deleteProduct(id) {
        return await this.productRepository.deleteProduct(id);
    }
}
