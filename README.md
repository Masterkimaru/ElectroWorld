⚡ ElectroWorld Backend

This is the backend for ElectroWorld, an e-commerce platform built with Express, TypeScript, and MongoDB.
It powers the APIs for product management, orders, user authentication, and other business logic for the ElectroWorld web application.

🚀 Tech Stack

Node.js + Express.js – REST API framework

TypeScript – Strong typing and cleaner code structure

MongoDB + Mongoose – Database and schema modeling

JWT Authentication – Secure user login and authorization

Nodemailer – Email notifications & invoicing

PDFKit – Dynamic invoice PDF generation

📂 Project Structure
ElectroWorld/
│
├── server/
│   ├── models/          # Mongoose models (Product, User, Order, etc.)
│   ├── routes/          # Express route handlers (products, orders, users)
│   ├── seedProducts.ts  # Script to seed initial products into MongoDB
│   └── index.ts         # App entry point
│
├── package.json
├── tsconfig.json
└── README.md

⚙️ Installation & Setup
1️⃣ Clone the repository
git clone https://github.com/Masterkimaru/ElectroWorld.git
cd ElectroWorld

2️⃣ Install dependencies
npm install

3️⃣ Configure environment variables

Create a .env file in the project root and define:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

4️⃣ Run the server in development
npm run dev

5️⃣ Build & run in production
npm run build
npm start

📌 API Endpoints
Products

GET /api/products → Fetch all products

GET /api/products/:id → Fetch single product

POST /api/products → Create a new product

PUT /api/products/:id → Update product

DELETE /api/products/:id → Delete product

Orders

POST /api/orders → Place a new order

GET /api/orders/:id → Fetch order details

GET /api/orders → List all orders

Users

POST /api/users/register → Register a new user

POST /api/users/login → Login and receive JWT

GET /api/users/profile → Get user profile (protected)

📄 Additional Features

Invoice Generation – Automatically generates a PDF invoice upon order confirmation using pdfkit.

Email Notifications – Sends order confirmation and invoices via nodemailer.

Database Seeder – Run npm run seed to insert sample products.

🛠 Development Scripts

npm run dev → Run server with ts-node-dev (watch mode)

npm run build → Compile TypeScript → JavaScript

npm start → Start server from build output

npm run seed → Seed sample products into MongoDB

📜 License

This project is licensed under the MIT License.
