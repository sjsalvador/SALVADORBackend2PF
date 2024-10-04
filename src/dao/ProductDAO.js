import Product from '../models/Product.js';

export default class ProductDAO {
    async findAll(query, options) {
        return await Product.paginate(query, options);
    }

    async findById(id) {
        return await Product.findById(id);
    }

    async createProduct(data) {
        const product = new Product(data);
        return await product.save();
    }

    async updateProduct(id, updates) {
        return await Product.findByIdAndUpdate(id, updates, { new: true });
    }

    async deleteProduct(id) {
        return await Product.findByIdAndDelete(id);
    }
}
