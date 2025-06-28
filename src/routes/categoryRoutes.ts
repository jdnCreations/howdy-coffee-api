import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.get('/', getAllCategories);
categoryRouter.get('/:id', getCategoryById);

categoryRouter.post('/', createCategory);

categoryRouter.put('/:id', updateCategory);

categoryRouter.delete('/:id', deleteCategory);

export default categoryRouter;