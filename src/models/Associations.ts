import Cart from './Cart.js';
import CartItem from './CartItem.js';
import Category from './Category.js';
import Product from './Product.js';

const setupAssociations = () => {
  Category.hasMany(Product, {
    foreignKey: 'categoryId',
    as: 'products',
  });
  Product.belongsTo(Category, {
    foreignKey: 'categoryId',
    as: 'category',
  });

  Cart.hasMany(CartItem, {
    foreignKey: 'cartId',
    as: 'items',
    onDelete: 'CASCADE',
  });
  CartItem.belongsTo(Cart, {
    foreignKey: 'cartId',
    as: 'cart',
  });
  CartItem.belongsTo(Product, {
    foreignKey: 'productId',
    as: 'product',
  });
  Product.hasMany(CartItem, {
    foreignKey: 'productId',
    as: 'cartItems',
  });
};

export { setupAssociations };
