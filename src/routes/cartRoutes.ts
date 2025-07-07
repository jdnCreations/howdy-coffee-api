import { Router } from 'express';
import {
  addItemToCart,
  createAnonymousCart,
  getCartContents,
  removeCartItem,
  updateCartItemQuantity,
} from '../controllers/cartController.js';

const cartRouter = Router();

cartRouter.post('/', createAnonymousCart);
cartRouter.get('/:cartToken', getCartContents);
cartRouter.post('/:cartToken/items', addItemToCart);
// refactor below routes to use /:itemId ? more clear
cartRouter.patch('/:cartToken/items', updateCartItemQuantity);
cartRouter.delete('/:cartToken/items', removeCartItem);

export default cartRouter;
