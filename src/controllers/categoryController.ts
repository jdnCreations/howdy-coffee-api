import { Request, Response } from 'express';
import Category from '../models/Category';

const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

const getCategoryById = async (req: Request, res: Response) => {
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

const createCategory = async (req: Request, res: Response) => {
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

const updateCategory = async (req: Request, res: Response) => {};
