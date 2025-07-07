import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import Product from './Product.js';

interface CartItemAttributes {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
}

interface CartItemCreationAttributes
  extends Optional<CartItemAttributes, 'id'> {}

class CartItem extends Model<CartItemAttributes, CartItemCreationAttributes> {
  public product?: Product;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default CartItem;
