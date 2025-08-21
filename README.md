⚡ ElectroWorld Backend

A robust Node.js backend API for the ElectroWorld e-commerce platform, providing complete functionality for product management, order processing, and customer interactions.

🌟 Features
🛍️ Core E-Commerce Functionality
RESTful API Design: Clean, consistent endpoints following REST principles

Product Management: Full CRUD operations for electronics products

Order Processing: Complete order lifecycle management

User Authentication: Secure JWT-based authentication system

Payment Integration: WhatsApp payment notification system

Email Notifications: Automated order confirmation emails

🛡️ Security & Validation
Input Validation: Comprehensive request validation using Joi

Authentication Middleware: Protected routes with JWT verification

CORS Configuration: Secure cross-origin resource sharing

Environment Configuration: Secure management of sensitive data

Rate Limiting: Protection against abuse and DDoS attacks

📊 Data Management
MongoDB Integration: NoSQL database for flexible data modeling

Image Handling: Cloudinary integration for product image management

Data Relationships: Well-structured relationships between collections

Database Indexing: Optimized query performance

🛠️ Technology Stack
Runtime: Node.js

Framework: Express.js

Database: MongoDB with Mongoose ODM

Authentication: JSON Web Tokens (JWT)

File Upload: Multer with Cloudinary integration

Validation: Joi

Email: Nodemailer with Gmail integration

Security: Helmet, CORS, bcryptjs

Development: Nodemon, Morgan

📦 Project Structure
text
ElectroWorld/
├── config/
│   ├── cloudinary.js          # Cloudinary configuration
│   ├── database.js            # MongoDB connection
│   └── verifyToken.js         # JWT authentication middleware
├── controllers/
│   ├── orderController.js     # Order management logic
│   ├── productController.js   # Product CRUD operations
│   └── userController.js      # User authentication & management
├── models/
│   ├── Order.js               # Order schema definition
│   ├── Product.js             # Product schema definition
│   └── User.js                # User schema definition
├── routes/
│   ├── orders.js              # Order-related endpoints
│   ├── products.js            # Product-related endpoints
│   └── users.js               # User authentication endpoints
├── uploads/                   # Temporary file storage
├── utils/
│   └── generateInvoice.js     # PDF invoice generation
├── validation/
│   ├── order.js               # Order validation schemas
│   ├── product.js             # Product validation schemas
│   └── user.js                # User validation schemas
├── .env                       # Environment variables
├── app.js                     # Express application setup
└── server.js                  # Server entry point
🚀 API Endpoints
Products
GET /api/products - Retrieve all products

GET /api/products/:id - Get single product

POST /api/products - Create new product (Admin only)

PUT /api/products/:id - Update product (Admin only)

DELETE /api/products/:id - Delete product (Admin only)

Orders
GET /api/orders - Get all orders (Admin only)

GET /api/orders/:id - Get specific order

POST /api/orders/checkout - Process new order

PUT /api/orders/:id - Update order status

DELETE /api/orders/:id - Delete order (Admin only)

Users
POST /api/users/register - User registration

POST /api/users/login - User authentication

GET /api/users/profile - Get user profile (Protected)

PUT /api/users/profile - Update user profile (Protected)

🚀 Getting Started
Prerequisites
Node.js (v14 or higher)

MongoDB Atlas account or local MongoDB installation

Cloudinary account for image storage

Gmail account for email notifications

Installation
Clone the repository:

bash
git clone https://github.com/Masterkimaru/ElectroWorld.git
cd ElectroWorld
Install dependencies:

bash
npm install
Set up environment variables:
Create a .env file in the root directory:

env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GMAIL_USER=your_gmail_address
GMAIL_PASS=your_gmail_app_password
WHATSAPP_PHONE=your_whatsapp_business_number
Start the development server:

bash
npm run dev
The API will be available at http://localhost:5000

📊 Database Models
Product Schema
javascript
{
  name: String,
  category: String, // Phones, Laptops, Accessories, Covers & Protectors
  price: Number,
  image: String, // Cloudinary URL
  description: String,
  inStock: Boolean,
  featured: Boolean
}
Order Schema
javascript
{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: Number
  }],
  totalAmount: Number,
  deliveryFee: Number,
  status: String, // pending, confirmed, shipped, delivered, cancelled
  customerInfo: {
    name: String,
    phone: String,
    email: String,
    location: String
  },
  deliveryLocation: String // Nairobi, Outside Nairobi
}
User Schema
javascript
{
  name: String,
  email: { type: String, unique: true },
  password: String, // Hashed with bcrypt
  phone: String,
  isAdmin: { type: Boolean, default: false }
}
🔧 Key Features Implementation
1. Authentication System
JWT-based authentication with secure token generation

Password hashing using bcryptjs

Protected routes with middleware verification

Role-based access control (Admin vs Regular users)

2. Image Upload Handling
Multer middleware for file processing

Cloudinary integration for optimized image storage

Automatic URL generation for frontend consumption

Support for multiple image formats and sizes

3. Order Processing
Comprehensive order validation

WhatsApp integration for order notifications

PDF invoice generation for customers

Email confirmation system

Order status tracking

4. Error Handling
Centralized error handling middleware

Consistent error response format

Validation errors with detailed messages

Database operation error handling

🛡️ Security Measures
Helmet.js: Sets various HTTP headers for security

CORS: Configurable cross-origin resource sharing

Input Validation: Prevents NoSQL injection and XSS attacks

Rate Limiting: Prevents brute force attacks

JWT Expiration: Short-lived access tokens

Password Hashing: bcrypt with salt rounds

📧 Integration Services
WhatsApp Business API
Automated order notifications to business number

Customer order details via WhatsApp

Order status updates

Gmail SMTP
Order confirmation emails

Invoice attachments

Customer communication

Cloudinary CDN
Optimized image delivery

Responsive image variants

Secure media storage

🚀 Deployment
Environment Setup
Set up MongoDB Atlas cluster

Configure Cloudinary account

Set up Gmail app password

Configure WhatsApp Business API

Production Deployment
bash
npm start
Environment Variables for Production
env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
# ... other production configurations
🧪 Testing
Run the test suite:

bash
npm test
API endpoints can be tested using:

Postman

Thunder Client (VS Code extension)

curl commands

📈 Performance Optimization
Database indexing on frequently queried fields

Mongoose query optimization

Response compression

Static file caching

Connection pooling for database

🔮 Future Enhancements
Redis caching for frequently accessed data

GraphQL API alongside REST endpoints

WebSocket support for real-time notifications

Advanced analytics and reporting

Admin dashboard with data visualization

Mobile app with React Native

Payment gateway integration (M-Pesa, Stripe)

Inventory management system

Customer review and rating system

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/amazing-feature)

Open a Pull Request

📞 Support
For technical support or questions about the ElectroWorld backend, please contact:

Email: themasterskimaru@gmail.com


📄 License
This project is proprietary software owned by ElectroWorld Kenya. All rights reserved.

👨‍💻 Developer
Built with ❤️ by MasterKimaru
Full Stack Developer specializing in Node.js and modern web applications
