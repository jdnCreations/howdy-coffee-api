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
};

export { setupAssociations };
