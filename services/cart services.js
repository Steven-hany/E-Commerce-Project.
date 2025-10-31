import { AppDataSource } from '../config/database.js';
import { Cart } from '../models/Cart.js';
import { CartItem } from '../models/CartItem.js';
import { Product } from '../models/Product.js';

const cartRepository = AppDataSource.getRepository(Cart);
const cartItemRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);

export class CartService {
  static async getOrCreateCart(userId) {
    let cart = await cartRepository.findOne({
      where: { user_id: userId },
      relations: ['cartItems', 'cartItems.product']
    });

    if (!cart) {
      cart = cartRepository.create({ user_id: userId });
      await cartRepository.save(cart);
    }

    return cart;
  }

  static async addOrUpdateItem(userId, productId, quantity) {
    if (quantity < 1) {
      throw new Error('Quantity must be at least 1');
    }

    const cart = await this.getOrCreateCart(userId);
    const product = await productRepository.findOne({ 
      where: { id: productId, deleted_at: null } 
    });

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      throw new Error('Insufficient stock');
    }

    let cartItem = await cartItemRepository.findOne({
      where: { cart_id: cart.id, product_id: productId }
    });

    if (cartItem) {
      cartItem.quantity = quantity;
    } else {
      cartItem = cartItemRepository.create({
        cart_id: cart.id,
        product_id: productId,
        quantity
      });
    }

    await cartItemRepository.save(cartItem);

    return await this.getCartWithTotals(cart.id);
  }

  static async removeItem(userId, productId) {
    const cart = await this.getOrCreateCart(userId);
    
    const result = await cartItemRepository.delete({
      cart_id: cart.id,
      product_id: productId
    });

    if (result.affected === 0) {
      throw new Error('Item not found in cart');
    }

    return await this.getCartWithTotals(cart.id);
  }

  static async getCartWithTotals(cartId) {
    const cart = await cartRepository.findOne({
      where: { id: cartId },
      relations: ['cartItems', 'cartItems.product']
    });

    if (!cart) {
      throw new Error('Cart not found');
    }

    let subtotal = 0;
    const items = cart.cartItems.map(item => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;

      return {
        id: item.id,
        product: {
          id: item.product.id,
          name: item.product.name,
          price: parseFloat(item.product.price)
        },
        quantity: item.quantity,
        total: parseFloat(itemTotal.toFixed(2))
      };
    });

    return {
      id: cart.id,
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  }

  static async clearCart(cartId) {
    await cartItemRepository.delete({ cart_id: cartId });
  }
}