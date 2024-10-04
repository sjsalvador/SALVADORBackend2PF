import ProductDAO from '../dao/ProductDAO.js';

export default class ProductRepository {
    constructor() {
        this.productDAO = new ProductDAO();
    }

    async findAll(query, options) {
        return await this.productDAO.findAll(query, options);
    }

    async findById(id) {
        return await this.productDAO.findById(id);
    }

    async createProduct(data) {
        return await this.productDAO.createProduct(data);
    }

    async updateProduct(id, updates) {
        return await this.productDAO.updateProduct(id, updates);
    }

    async deleteProduct(id) {
        return await this.productDAO.deleteProduct(id);
    }
}
