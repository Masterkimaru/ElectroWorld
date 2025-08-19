// server/seedProducts.ts
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product';

// Load .env (if present)
dotenv.config();

const MONGO_URI = process.env.MONGO_URI as string;

// Plain object shape for seed items with updated working image URLs
const products: { name: string; category: string; price: number; image: string }[] = [
  // Phones
  { name: 'Samsung Galaxy A16', category: 'Phones', price: 21000, image: 'https://image-us.samsung.com/SamsungUS/home/mobile/phones/12122024/SDSAC-8512-1_Galaxy-A16_5G_Blue-Black_Front_RGB-1600x1200.jpg' },
  { name: 'Iphone 14 pro max', category: 'Phones', price: 115000, image: 'https://www.apple.com/newsroom/images/product/iphone/standard/Apple-iPhone-14-Pro-iPhone-14-Pro-Max-deep-purple-220907_inline.jpg.large.jpg' },
  { name: 'Samsung Note 8', category: 'Phones', price: 27000, image: 'https://m.media-amazon.com/images/I/61IQ+xiCXUL.jpg' },
  { name: 'Nokia 105', category: 'Phones', price: 105, image: 'https://saruk.co.ke/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdm0idgzwi%2Fimage%2Fupload%2Fv1706823706%2Fzswnbwrfqmaylxso2q68.jpg&w=3840&q=75' },

  // Covers — use exact enum string defined in your model ("Covers & Protectors")
  { name: 'Silicon cover', category: 'Covers & Protectors', price: 1000, image: 'https://m.media-amazon.com/images/I/51mntuLCp5L.jpg' },
  { name: 'Magnetic Cover', category: 'Covers & Protectors', price: 1000, image: 'https://m.media-amazon.com/images/I/71sajlCquGL._UF1000,1000_QL80_.jpg' },
  { name: 'Nilkin cover', category: 'Covers & Protectors', price: 2000, image: 'https://m.media-amazon.com/images/I/71XR3ORz4lL.jpg' },
  { name: 'Protector', category: 'Covers & Protectors', price: 500, image: 'https://m.media-amazon.com/images/I/61hkgjDvLYL.jpg' },
  { name: 'Privacy Protector', category: 'Covers & Protectors', price: 1000, image: 'https://m.media-amazon.com/images/I/513RAdxpYcL.jpg' },

  // Laptops
  { name: 'Hp EliteBook', category: 'Laptops', price: 25000, image: 'https://shoptech.co.ke/wp-content/uploads/2025/08/51qN4gjtwAL._AC_SL1200_.jpg' },

  // Accessories
  { name: 'C to C iphone cable', category: 'Accessories', price: 1000, image: 'https://m.media-amazon.com/images/I/61hBhfB9AcL.jpg' },
  { name: '35w iPhone charger', category: 'Accessories', price: 3000, image: 'https://m.media-amazon.com/images/I/71XR3ORz4lL.jpg' },
  { name: '25w iPhone charger', category: 'Accessories', price: 2500, image: 'https://m.media-amazon.com/images/I/61sdPw93yCL._UF1000,1000_QL80_.jpg' },
  { name: '25w iPhone adapter', category: 'Accessories', price: 1500, image: 'https://m.media-amazon.com/images/I/61XR3ORz4lL.jpg' },
  { name: 'Samsung 65w charger', category: 'Accessories', price: 3000, image: 'https://www.samsung.com/us/mobile/mobile-accessories/phones/65w-trio-adapter-ep-t6530nbegus/' },
  { name: 'C to C charging cable', category: 'Accessories', price: 1000, image: 'https://m.media-amazon.com/images/I/61hkgjDvLYL.jpg' },
  { name: 'Samsung 25w charger', category: 'Accessories', price: 2000, image: 'https://images-na.ssl-images-amazon.com/images/I/51cdGlDWqEL._AC_SL1500_.jpg' },
  { name: 'Samsung 45w charger', category: 'Accessories', price: 2500, image: 'https://images-na.ssl-images-amazon.com/images/I/51A8lqBBRiL._AC_SL1500_.jpg' },
  { name: 'Oraimo watch ER', category: 'Accessories', price: 7000, image: 'https://ng.oraimo.com/cdn/shop/products/OSW-42_Black_1.jpg' },
  { name: 'Oraimo Watch', category: 'Accessories', price: 5000, image: 'https://ng.oraimo.com/cdn/shop/products/OSW-42_Black_2.jpg' },
  { name: 'Oraimo Powerbank 2000mah', category: 'Accessories', price: 3000, image: 'https://ng.oraimo.com/cdn/shop/products/OPB-P204D_Black_1.jpg' },
  { name: 'Oraimo Freepods 3c', category: 'Accessories', price: 3500, image: 'https://ng.oraimo.com/cdn/shop/products/OEB-E104DC_White_1.jpg' },
  { name: 'Oraimo Car Adapter', category: 'Accessories', price: 1000, image: 'https://ng.oraimo.com/cdn/shop/products/OCC-01D_Black_1.jpg' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Upsert each product by name to avoid duplicates on repeated runs
    for (const p of products) {
      await Product.findOneAndUpdate(
        { name: p.name },
        { $set: p },
        { upsert: true, setDefaultsOnInsert: true }
      );
      console.log(`Upserted: ${p.name}`);
    }

    console.log('Seeding finished.');
  } catch (err) {
    console.error('Seed failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

seed();
