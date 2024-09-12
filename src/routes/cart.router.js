import express from 'express';
import passport from 'passport';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Ticket from '../models/Ticket.js';
import { authorizeUser, authorizeAdmin } from '../middleware/authMiddleware.js';
import crypto from 'crypto';

const router = express.Router();

// Aplicar middleware de Passport para verificar la autenticación
router.use(passport.authenticate('jwt', { session: false }));

// Crear un nuevo carrito
router.post('/', authorizeUser, async (req, res) => {
  try {
    const newCart = new Cart({ user: req.user._id, products: [] }); 
    await newCart.save();
    res.status(201).json({ status: 'success', message: 'Carrito creado', cart: newCart });
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error al crear el carrito' });
  }
});

// Agregar un producto al carrito - Solo usuarios
router.post('/:cid/product/:pid', authorizeUser, async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid);
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });

    const productInCart = cart.products.find(item => item.product.toString() === pid);
    if (productInCart) {
      productInCart.quantity += 1; 
    } else {
      cart.products.push({ product: pid, quantity: 1 }); 
    }

    await cart.save();
    res.status(200).json({ status: 'success', message: 'Producto agregado al carrito', cart });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Error al agregar producto al carrito' });
  }
});


// Obtener los detalles de un carrito
router.get('/:cid', authorizeUser, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    res.status(200).json({ status: 'success', cart });
  } catch (error) {
    console.error('Error al obtener los detalles del carrito:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los detalles del carrito' });
  }
});


// Obtener todos los carritos
router.get('/', authorizeUser, async (req, res) => {
  try {
    const carts = await Cart.find().populate('products.product');
    res.status(200).json({ status: 'success', carts });
  } catch (error) {
    console.error('Error al obtener los carritos:', error);
    res.status(500).json({ status: 'error', message: 'Error al obtener los carritos' });
  }
});

// Finalizar la compra de un carrito
router.post('/:cid/purchase', authorizeUser, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate('products.product');
    if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

    let totalAmount = 0;
    const notProcessedProducts = [];

    for (const item of cart.products) {
      const product = item.product;

      if (product.stock >= item.quantity) {
        product.stock -= item.quantity; 
        totalAmount += product.price * item.quantity; 
        await product.save(); 
      } else {
        // Producto no procesado completamente, agregar a la lista de no procesados
        notProcessedProducts.push({
          productId: product._id,
          requestedQuantity: item.quantity,
          availableStock: product.stock
        });

        // Ajustar la cantidad al máximo disponible
        totalAmount += product.price * product.stock;
        product.stock = 0;
        await product.save(); // Guardar los cambios del producto
      }
    }

    const newTicket = new Ticket({
      code: crypto.randomBytes(8).toString('hex'), // Generar un código único para el ticket
      purchase_datetime: new Date(), // Fecha y hora actual
      amount: totalAmount,
      purchaser: req.user.email // Correo del usuario que realizó la compra
    });
    await newTicket.save();

    // Actualizar el carrito eliminando los productos que fueron completamente procesados
    cart.products = cart.products.filter(p => !notProcessedProducts.some(np => np.productId.equals(p.product._id)));
    await cart.save();

    res.json({ status: 'success', ticket: newTicket, notProcessedProducts });
  } catch (error) {
    console.error('Error al finalizar la compra:', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;
