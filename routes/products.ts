// server/routes/products.ts
import { Router } from 'express';
import Product from '../models/Product';

const router = Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {  // Make sure this has :id (not just :)
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new product
router.post('/', async (req, res) => {
  try {
    const { name, category, price, image } = req.body;

    // Validation
    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Phones', 'Covers & Protectors', 'Laptops', 'Accessories'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = new Product({
      name,
      category,
      price,
      image
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update entire product
router.put('/:id', async (req, res) => {  // Make sure this has :id
  try {
    const { name, category, price, image } = req.body;

    // Validation
    if (!name || !category || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!['Phones', 'Covers & Protectors', 'Laptops', 'Accessories'].includes(category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, category, price, image },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH partially update product
router.patch('/:id', async (req, res) => {  // Make sure this has :id
  try {
    const updates = req.body;

    // Validate category if provided
    if (updates.category && !['Phones', 'Covers & Protectors', 'Laptops', 'Accessories'].includes(updates.category)) {
      return res.status(400).json({ message: 'Invalid category' });
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE product
router.delete('/:id', async (req, res) => {  // Make sure this has :id
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// OPTIONS (for CORS preflight requests)
router.options('/', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

router.options('/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.status(200).end();
});

export default router;