export default class CartDTO {
    constructor(cart) {
        this.id = cart._id;
        this.products = cart.products.map(p => ({
            productId: p.product._id,
            quantity: p.quantity,
        }));
    }
}
