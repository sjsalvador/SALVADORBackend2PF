import CartRepository from '../repository/CartRepository.js';
import CartDTO from '../dto/CartDTO.js';

export default class CartService {
    constructor() {
        this.cartRepository = new CartRepository();
    }

    async createCart(data) {
        const cart = await this.cartRepository.createCart(data);
        return new CartDTO(cart);
    }

    async getCartById(id) {
        const cart = await this.cartRepository.findById(id);
        return new CartDTO(cart);
    }
}
