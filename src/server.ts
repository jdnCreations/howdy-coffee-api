import express, { Request, Response } from 'express';
import { connectDB, sequelize } from './db.js';
import { setupAssociations } from './models/Associations.js';
import seedDB from './seed.js';
import categoryRouter from './routes/categoryRoutes.js';
import productRouter from './routes/productRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';

app.use(express.json());

app.use('/api/categories', categoryRouter);
app.use('/api/products', productRouter);

const startServer = async () => {
  await connectDB();
  setupAssociations();
  await sequelize.sync({ force: false });

  console.log('All models were synchronized successfully.');

  // DEV ONLY
  if (NODE_ENV == 'dev') {
    await seedDB();
  }

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'howdy coffee API is running!' });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

startServer();
