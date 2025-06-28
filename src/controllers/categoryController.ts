import { Request, Response } from 'express';
import Category from '../models/Category.js';
import { where } from 'sequelize';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: 'Invalid Category ID' });
    return;
  }

  try {
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      res.status(404).json({ message: 'No Category exists with id' });
      return;
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).json({ message: 'Category must have a name' });
    return;
  }
  try {
    await Category.create({
      name,
    });
    res.status(201).json({ message: `Category ${name} created` });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!id) {
    res.status(400).json({message: "Invalid id"})
    return;
  }
  const {name} = req.body;
  if (!name) {
    res.status(400).json({message: "Category must have a name"});
    return;
  }
  try {
    const category = await Category.findOne({where:{id}})
    if (!category) {
      res.status(404).json({message: "Category does not exist"})
    }
    await category.update({name});
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  const {id} = req.params;
  if (!id) {
    res.status(400).json({message: "Invalid id"});
    return;
  }

  try {
    const deleted = await Category.destroy({where:{id}});
    if (deleted == 0) {
      res.status(404).json({message: "Category does not exist"});
      return;
    }

    res.status(200).json({message: "Category deleted"});
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"});
  }
}
