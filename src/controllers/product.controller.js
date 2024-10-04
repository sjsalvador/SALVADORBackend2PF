import ProductService from '../services/ProductService.js';

const productService = new ProductService();

export const createProduct = async (req, res) => {
    try {
        const product = await productService.createProduct(req.body);
        res.status(201).json({ status: 'success', payload: product });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts(req.query, { page: 1, limit: 10 });
        res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
