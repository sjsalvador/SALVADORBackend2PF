import CartService from '../services/CartService.js';

const cartService = new CartService();

export const createCart = async (req, res) => {
    try {
        const cart = await cartService.createCart({ user: req.user._id });
        res.status(201).json({ status: 'success', cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
