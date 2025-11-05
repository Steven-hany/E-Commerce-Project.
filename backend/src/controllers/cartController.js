import { body, param, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { AppDataSource } from '../data-source.js';
import { CartSchema } from '../models/Cart.js';
import { CartItemSchema } from '../models/CartItem.js';
import { ProductSchema } from '../models/Product.js';

// 🛒 عرض سلة المستخدم
export const getCart = asyncHandler(async (req, res) => {
  const cartRepo = AppDataSource.getRepository(CartSchema);

  let cart = await cartRepo.findOne({
    where: { user_id: req.user.id },
    relations: ['cartItems', 'cartItems.product'],
  });

  if (!cart) {
    cart = cartRepo.create({ user_id: req.user.id });
    await cartRepo.save(cart);
  }

  const total = cart.cartItems?.reduce((sum, item) => {
    return sum + item.quantity * item.product.price;
  }, 0) || 0;

  res.json({ ...cart, total });
});

// ➕ إضافة أو تعديل عنصر في السلة
export const addOrUpdateCartItem = [
  body('productId').isString().withMessage('Valid product ID is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { productId, quantity } = req.body;
    const parsedQuantity = Math.floor(Number(quantity));

    const cartRepo = AppDataSource.getRepository(CartSchema);
    const itemRepo = AppDataSource.getRepository(CartItemSchema);
    const productRepo = AppDataSource.getRepository(ProductSchema);

    let cart = await cartRepo.findOne({ where: { user_id: req.user.id } });

    if (!cart) {
      cart = cartRepo.create({ user_id: req.user.id });
      await cartRepo.save(cart);
    }

    let item = await itemRepo.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId }
      },
      relations: ['cart', 'product'],
    });

    if (item) {
      item.quantity = parsedQuantity;
    } else {
      const product = await productRepo.findOneBy({ id: productId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }

      item = itemRepo.create({
        cart,
        product,
        quantity: parsedQuantity,
      });
    }

    await itemRepo.save(item);

    const updatedCart = await cartRepo.findOne({
      where: { id: cart.id },
      relations: ['cartItems', 'cartItems.product'],
    });

    res.json(updatedCart);
  })
];

// ❌ حذف عنصر من السلة
export const removeCartItem = [
  param('productId').isString().withMessage('Valid product ID is required'),

  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const itemRepo = AppDataSource.getRepository(CartItemSchema);

    const item = await itemRepo.findOne({
      where: {
        cart: { user_id: req.user.id },
        product: { id: req.params.productId }
      },
      relations: ['cart', 'product'],
    });

    if (!item) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    await itemRepo.remove(item);

    res.json({ success: true, message: 'Item removed from cart' });
  })
];

// ✅ تنفيذ عملية الشراء
export const checkout = asyncHandler(async (req, res) => {
  const cartRepo = AppDataSource.getRepository(CartSchema);
  const itemRepo = AppDataSource.getRepository(CartItemSchema);

  const cart = await cartRepo.findOne({
    where: { user_id: req.user.id },
    relations: ['cartItems', 'cartItems.product'],
  });

  if (!cart || cart.cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  await itemRepo.remove(cart.cartItems);

  res.json({ success: true, message: 'Checkout completed successfully' });
});