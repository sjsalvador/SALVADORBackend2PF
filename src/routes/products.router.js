import express from 'express';
import passport from 'passport';
import Product from '../models/Product.js';
import { authorizeAdmin } from '../middleware/authMiddleware.js';

const createProductsRouter = (io) => {
  const router = express.Router();

  // Aplico middleware de Passport para verificar la autenticación antes de las rutas protegidas
  router.use(passport.authenticate('jwt', { session: false }));

  // Ruta para crear un producto - Solo admin
  router.post('/', authorizeAdmin, async (req, res) => {
    try {
      const { title, description, code, price, status, stock, category } = req.body;
      const newProduct = new Product({ title, description, code, price, status, stock, category });
      const savedProduct = await newProduct.save();
      res.status(201).json({ status: 'success', payload: savedProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Ruta para actualizar un producto - Solo admin
  router.put('/:pid', authorizeAdmin, async (req, res) => {
    try {
      const { pid } = req.params;
      const updates = req.body;
      const updatedProduct = await Product.findByIdAndUpdate(pid, updates, { new: true });
      if (!updatedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.status(200).json({ status: 'success', payload: updatedProduct });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Ruta para eliminar un producto - Solo admin
  router.delete('/:pid', authorizeAdmin, async (req, res) => {
    try {
      const { pid } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(pid);
      if (!deletedProduct) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
      res.status(200).json({ status: 'success', message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
    }
  });

  // Ruta para obtener todos los productos con filtros, paginación y ordenamiento
  router.get('/', async (req, res) => {
    try {
      // Obtener posibles filtros, paginación y opciones de ordenamiento de los parámetros de consulta
      const { page = 1, limit = 10, sort = 'title', order = 'asc', category, maxPrice } = req.query;
      let query = {};

      if (category) {
        query.category = category;
      }
      if (maxPrice) {
        query.price = { $lte: maxPrice };
      }

      // Definir opciones de paginación y ordenamiento
      const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sort]: order === 'asc' ? 1 : -1 }
      };

      // Buscar productos con filtros, paginación y ordenamiento
      const products = await Product.paginate(query, options); 

      res.status(200).json({ status: 'success', payload: products });
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      res.status(500).json({ status: 'error', message: 'Error al obtener los productos' });
    }
  });

  return router;
};

export default createProductsRouter;
