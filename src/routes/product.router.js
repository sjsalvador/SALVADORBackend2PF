import express from 'express';
import { createProduct, getProducts } from '../controllers/product.controller.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authorizeAdmin, createProduct);
router.get('/', getProducts);

export default router;
