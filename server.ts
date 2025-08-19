// server/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import productRoutes from './routes/products';
import orderRoutes from './routes/orders';
import * as path from 'path';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serve static invoices
app.use('/invoices', express.static(path.join(__dirname, '../invoices')));

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

const PORT = process.env.PORT || 5000;

// Ensure invoices directory exists
const fs = require('fs');
const dir = path.join(__dirname, '../invoices');
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});