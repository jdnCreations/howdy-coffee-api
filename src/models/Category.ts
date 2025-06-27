import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../db.js';

interface CategoryAttributes {
  id: number;
  name: string;
}

interface CategoryCreationAttributes
  extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> {}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

export default Category;
