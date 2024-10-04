import Cart from '../models/Cart.js';

export default class CartDAO {
    async createCart(data) {
        const cart = new Cart(data);
        return await cart.save();
    }

    async findById(id) {
        return await Cart.findById(id).populate('products.product');
    }

    async updateCart(id, updates) {
        return await Cart.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteCart(id) {
        return await Cart.findByIdAndDelete(id);
    }
}
