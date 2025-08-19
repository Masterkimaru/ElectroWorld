// server/models/Product.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  category: 'Phones' | 'Covers & Protectors' | 'Laptops' | 'Accessories';
  price: number;
  image: string; // URL to image
}

const ProductSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Phones', 'Covers & Protectors', 'Laptops', 'Accessories'] },
  price: { type: Number, required: true },
  image: { type: String, required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);