import CartDAO from '../dao/CartDAO.js';

export default class CartRepository {
    constructor() {
        this.cartDAO = new CartDAO();
    }

    async createCart(data) {
        return await this.cartDAO.createCart(data);
    }

    async findById(id) {
        return await this.cartDAO.findById(id);
    }

    async updateCart(id, updates) {
        return await this.cartDAO.updateCart(id, updates);
    }

    async deleteCart(id) {
        return await this.cartDAO.deleteCart(id);
    }
}
