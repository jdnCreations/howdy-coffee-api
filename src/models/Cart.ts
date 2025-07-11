import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';
import CartItem from './CartItem.js';

interface CartAttributes {
  id: number;
  cartToken: string;
  items?: CartItem[];
}

interface CartCreationAttributes extends Optional<CartAttributes, 'id'> {}

class Cart extends Model<CartAttributes, CartCreationAttributes> {}

Cart.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cartToken: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Cart;
