import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductById, updateProduct } from "../controllers/productController.js";

const productRouter = Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);

productRouter.post('/', createProduct);

productRouter.put('/:id', updateProduct);

productRouter.delete('/:id', deleteProduct);

export default productRouter;