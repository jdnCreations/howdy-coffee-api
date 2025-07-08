import { randomUUID } from 'crypto';
import { Request, Response } from 'express';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Product from '../models/Product.js';

export const createAnonymousCart = async (req: Request, res: Response) => {
  const newToken = randomUUID();
  try {
    const cart = await Cart.create({ cartToken: newToken });
    res
      .status(201)
      .json({ id: cart.dataValues.id, cartToken: cart.dataValues.cartToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Could not create anonymous cart.' });
  }
};

export const getCartContents = async (req: Request, res: Response) => {
  const { cartToken } = req.params;
  if (!cartToken) {
    res.status(400).json({ message: 'Invalid cart token' });
    return;
  }
  try {
    const cart = await Cart.findOne({
      where: { cartToken },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl'],
            },
          ],
        },
      ],
    });
    if (!cart) {
      res.status(404).json({ message: 'No cart found with that token.' });
      return;
    }

    res.status(200).json(cart.dataValues);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error: Could not get cart contents' });
  }
};

export const addItemToCart = async (req: Request, res: Response) => {
  const { cartToken } = req.params;
  if (!cartToken) {
    res.status(400).json({ message: 'Invalid cart token' });
    return;
  }
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    res.status(400).json({ message: 'Invalid productId or quantity' });
    return;
  }
  try {
    const fetchedCart = await Cart.findOne({
      where: { cartToken },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl'],
            },
          ],
        },
      ],
    });
    if (!fetchedCart) {
      res.status(404).json({ message: 'No cart found with that token' });
      return;
    }

    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      res.status(404).json({ message: 'No product found with that id' });
      return;
    }

    const cart = fetchedCart as Cart & {
      items: (CartItem & { product: Product })[];
    };

    if (cart.items.length === 0) {
      const addedItem = await CartItem.create({
        cartId: cart.dataValues.id,
        productId: product.dataValues.id,
        quantity: quantity,
      });

      res.status(201).json(addedItem);
      return;
    }

    let existingCartItem = cart.items.find(
      (item) => item.dataValues.productId === productId
    );

    if (existingCartItem) {
      const cartItem = await CartItem.findByPk(existingCartItem.dataValues.id);
      await cartItem.update({
        cartId: cartItem.dataValues.cartId,
        id: cartItem.dataValues.id,
        productId: cartItem.dataValues.productId,
        quantity: cartItem.dataValues.quantity + quantity,
      });

      const updatedCartItemWithProduct = await CartItem.findByPk(
        cartItem.dataValues.id,
        {
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl'],
            },
          ],
        }
      );

      res.status(200).json(updatedCartItemWithProduct);
      return;
    } else {
      const newCartItem = await CartItem.create({
        cartId: cart.dataValues.id,
        productId: productId,
        quantity: quantity,
      });

      const createdCartItemWithProduct = await CartItem.findByPk(
        newCartItem.dataValues.id,
        {
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl'],
            },
          ],
        }
      );

      res.status(201).json(createdCartItemWithProduct);
      return;
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error: Could not add item to cart' });
  }
};

export const updateCartItemQuantity = async (req: Request, res: Response) => {
  const { cartToken } = req.params;
  const { productId, quantity }: { productId: number; quantity: number } =
    req.body;

  if (!cartToken) {
    res.status(400).json({ message: 'Invalid cart token' });
    return;
  }

  if (!productId || !quantity) {
    res.status(400).json({ message: 'Invalid productId or quantity' });
    return;
  }

  try {
    const fetchedCart = await Cart.findOne({
      where: { cartToken },
      include: [
        {
          model: CartItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['id', 'name', 'price', 'imageUrl'],
            },
          ],
        },
      ],
    });
    if (!fetchedCart) {
      res.status(404).json({ message: 'No cart found with that token' });
      return;
    }

    const cart = fetchedCart as Cart & {
      items: (CartItem & { product: Product })[];
    };

    let existingCartItem = cart.items.find(
      (item) => item.dataValues.productId === productId
    );

    if (!existingCartItem) {
      res.status(404).json({ message: 'Item is not in cart' });
      return;
    }

    const cartItem = await CartItem.findByPk(existingCartItem.dataValues.id);
    const updated = await cartItem.update({
      quantity: quantity,
    });

    if (!updated) {
      res.status(404).json({ message: 'Could not update cartitem' });
      return;
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Internal Server Error: Could not update cart item quantity',
    });
  }
};

export const removeCartItem = async (req: Request, res: Response) => {
  console.log(`body: ${req.body}`);
  const { cartToken } = req.params;
  const { productId } = req.body;
  if (!cartToken) {
    res.status(400).json({ message: 'Invalid cart token' });
    return;
  }

  if (!productId) {
    res.status(400).json({ message: 'Invalid productId' });
    return;
  }

  console.log(cartToken, productId);

  try {
    const cart = await Cart.findOne({ where: { cartToken } });
    if (!cart) {
      res.status(404).json({ message: 'Cart does not exist' });
      return;
    }

    const cartItem = await CartItem.findOne({ where: { productId } });
    if (!cartItem) {
      res.status(404).json({ message: 'Cart Item does not exist' });
      return;
    }

    cartItem.destroy();
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: 'Internal Server Error: Cannot remove item from cart' });
  }
};
