import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

interface ProductAttributes {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  categoryId: number;
}

interface ProductCreationAttributes
  extends Optional<ProductAttributes, 'description' | 'imageUrl'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> {}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Product;
