import { UUID } from 'sequelize';
import Cart from './models/Cart.js';
import Category from './models/Category.js';
import Product from './models/Product.js';
import { randomUUID } from 'crypto';
import CartItem from './models/CartItem.js';

// FOR DEVELOPMENT ONLY
const seedDB = async () => {
  if (await Category.findOne({ where: { id: 1 } })) {
    return;
  }
  await Category.create({
    id: 1,
    name: 'Coffee Beans',
  });
  await Category.create({
    id: 2,
    name: 'Tools',
  });
  await Category.create({
    id: 3,
    name: 'Merchandise',
  });

  await Product.create({
    id: 1,
    categoryId: 1,
    name: 'A.M Accolade',
    price: 22.0,
  });

  await Product.create({
    categoryId: 1,
    name: 'Hello Brew',
    price: 27.0,
  });

  await Product.create({
    categoryId: 1,
    name: 'Sunrise Salute',
    price: 24.0,
  });

  await Product.create({
    categoryId: 1,
    name: 'Kindred Welcome',
    price: 31.0,
  });

  await Product.create({
    categoryId: 1,
    name: 'Friendly こんにちは',
    price: 31.0,
  });

  await Product.create({
    categoryId: 2,
    name: 'Stainless Tamp',
    price: 14.0,
  });

  await Product.create({
    categoryId: 2,
    name: 'Milk Jug',
    price: 9.0,
  });

  await Product.create({
    categoryId: 2,
    name: 'Knockbox',
    price: 40.0,
  });

  await Product.create({
    categoryId: 3,
    name: 'Howdy Coffee Co. Classic Tee',
    price: 30.0,
  });

  await Product.create({
    categoryId: 3,
    name: 'Howdy Coffee Co. Classic Hood',
    price: 70.0,
  });

  await Product.create({
    categoryId: 3,
    name: 'Howdy Coffee Co. Classic Socks',
    price: 15.0,
  });

  await Cart.create({
    id: 1,
    cartToken: randomUUID(),
  });

  await CartItem.create({
    cartId: 1,
    productId: 1,
    quantity: 2,
  });
};

export default seedDB;
