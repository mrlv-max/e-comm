// Import all our tools
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Stripe from 'stripe'; 
import dotenv from 'dotenv';
import fetch from 'node-fetch'; // Importing fetch polyfill

dotenv.config(); 

// Initialize our app and tools
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = 'your-super-secret-key-123';

// --- PAYMENT & LLM SETUP ---
// Using a hardcoded test key for reliable simulation (no .env required)
const stripe = new Stripe('sk_test_51HqrbmKq01T9zW9s8FwR1F2XwN6qWlM8yL2kR4Ea1F2XwN6qWlM8yL2kR4Ea1F2XwN6qWlM8yL2kR4Ea1F2XwN6qWlM8yL2kR4E');

// Gemini API Configuration (Key will be provided by the environment)
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";
const GEMINI_API_KEY = ""; 
// --- END SETUP ---

// --- Global Middleware ---
app.use(cors());
app.use(express.json()); // This ensures req.body is correctly parsed

// --- Routes ---
app.get('/api/test', (req, res) => {
  res.send('Server is running!');
});

/* User Registration Endpoint (FIXED for Shop Creation) */
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, name, password, role } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    
    let existingUser = await prisma.user.findUnique({
      where: { email: lowerCaseEmail },
    });

    if (existingUser) {
      // If user exists, skip creation but proceed to ensure shop exists (if vendor)
      console.log(`User ${lowerCaseEmail} already exists. Checking shop.`);
    } else {
      // Create the new user
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser = await prisma.user.create({
        data: { email: lowerCaseEmail, name: name, password: hashedPassword, role: role },
      });
      console.log(`New user created: ${lowerCaseEmail}`);
    }

    // FINAL FIX: Ensure Shop entry exists if the role is VENDOR (fixes dashboard issues)
    if (existingUser.role === 'VENDOR') {
      const existingShop = await prisma.shop.findUnique({ where: { userId: existingUser.id } });
      if (!existingShop) {
        await prisma.shop.create({
          data: { name: `${existingUser.name}'s Shop`, description: 'New shop created.', userId: existingUser.id },
        });
        console.log(`Shop created for Vendor ID: ${existingUser.id}`);
      }
    }
    
    res.status(201).json({ message: 'User created successfully', userId: existingUser.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/* User Login Endpoint */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const lowerCaseEmail = email.toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: lowerCaseEmail } });
    if (!user) { return res.status(401).json({ message: 'Invalid email or password' }); }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) { return res.status(401).json({ message: 'Invalid email or password' }); }

    const token = jwt.sign({ userId: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ message: 'Login successful', token: token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/* Authentication Middleware */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) { return res.status(401).json({ message: 'Access denied. No token provided.' }); }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (ex) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

/* Public Product Routes */
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ include: { shop: true } });
    res.status(200).json(products);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

/* GET Single Product (Includes Reviews) */
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id: parseInt(id) }, include: { shop: true, reviews: { include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' } } } });
    if (!product) { return res.status(404).json({ message: 'Product not found' }); }
    res.status(200).json(product);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

/* Protected Vendor Routes */
app.post('/api/products', authMiddleware, async (req, res) => {
  if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Not a vendor.' }); }
  try {
    const { name, description, price, imageUrl, stock } = req.body;
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId } });
    if (!shop) { return res.status(404).json({ message: 'Vendor shop not found.' }); }
    const newProduct = await prisma.product.create({ data: { name, description, price, imageUrl, stock, shopId: shop.id } });
    res.status(201).json(newProduct);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

app.get('/api/vendor/my-products', authMiddleware, async (req, res) => {
  if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Not a vendor.' }); }
  try {
    const shop = await prisma.shop.findUnique({ where: { userId: req.user.userId } });
    if (!shop) { return res.status(404).json({ message: 'Vendor shop not found.' }); }
    const products = await prisma.product.findMany({ where: { shopId: shop.id } });
    res.status(200).json(products);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Not a vendor.' }); }
  try {
    const { id } = req.params;
    const { name, description, price, imageUrl, stock } = req.body;
    const updatedProduct = await prisma.product.update({ where: { id: parseInt(id) }, data: { name, description, price, imageUrl, stock } });
    res.status(200).json(updatedProduct);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Not a vendor.' }); }
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id: parseInt(id) } });
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

/* Protected Customer Routes (Order) */
app.post('/api/orders', authMiddleware, async (req, res) => {
  if (req.user.role !== 'CUSTOMER') { return res.status(403).json({ message: 'Access denied. Only customers can place orders.' }); }
  const { items } = req.body;
  if (!items || items.length === 0) { return res.status(400).json({ message: 'Cart is empty' }); }
  try {
    const newOrder = await prisma.$transaction(async (tx) => {
      // Order creation logic here...
      return { id: 1, total: 1000 }; // Mock order for now
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

/* Order History Routes */
app.get('/api/orders/my-orders', authMiddleware, async (req, res) => {
  if (req.user.role !== 'CUSTOMER') { return res.status(403).json({ message: 'Access denied. Not a customer.' }); }
  try {
    const orders = await prisma.order.findMany({ where: { customerId: req.user.userId }, include: { items: { include: { product: true } } }, orderBy: { createdAt: 'desc' } });
    res.status(200).json(orders);
  } catch (error) { res.status(500).json({ message: 'Something went wrong', error }); }
});

app.get('/api/vendor/my-sales', authMiddleware, async (req, res) => {
  if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Not a vendor.' }); }
  try {
    const soldItems = await prisma.orderItem.findMany({ /* Complex Query */ });
    res.status(200).json(soldItems);
  } catch (error) { console.error("Failed to get vendor sales:", error); res.status(500).json({ message: 'Something went wrong', error }); }
});

/* Review System Routes */
app.post('/api/products/:id/reviews', authMiddleware, async (req, res) => {
  if (req.user.role !== 'CUSTOMER') { return res.status(403).json({ message: 'Only customers can leave reviews.' }); }
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await prisma.review.create({ data: { rating: parseInt(rating), comment, productId: parseInt(id), userId: req.user.userId }, include: { user: { select: { name: true } } } });
    res.status(201).json(review);
  } catch (error) { console.error("Review error:", error); res.status(500).json({ message: 'Failed to post review', error }); }
});

/* Payment Gateway Endpoint (Simulated) */
app.post('/api/payments/create-payment-intent', authMiddleware, async (req, res) => {
  if (req.user.role !== 'CUSTOMER') { return res.status(403).json({ message: 'Access denied.' }); }
  const { items } = req.body;
  if (!items || items.length === 0) { return res.status(400).json({ message: 'Cart is empty' }); }
  try {
    const totalAmountInCents = 1000; // Mock value for reliable testing
    const paymentIntent = await stripe.paymentIntents.create({ amount: totalAmountInCents, currency: 'inr', automatic_payment_methods: { enabled: true } });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) { console.error("Stripe error:", error); res.status(500).json({ message: 'Something went wrong', error: error.message }); }
});

/* Gemini API: Marketing Description Generator */
app.post('/api/gemini/generate-description', authMiddleware, async (req, res) => {
    if (req.user.role !== 'VENDOR') { return res.status(403).json({ message: 'Access denied. Only vendors can use the generator.' }); }
    const { itemType, material, theme, keywords } = req.body;
    const userPrompt = `You are a creative marketing assistant... Generate a highly engaging, two-paragraph product description... Item Type: ${itemType}...`;

    try {
        const fetch = (await import('node-fetch')).default;
        const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=";
        const GEMINI_API_KEY = ""; // Placeholder: The key will be provided by the environment
        
        const payload = { contents: [{ parts: [{ text: userPrompt }] }], systemInstruction: { parts: [{ text: "You are a world-class e-commerce copywriter..." }] } };
        const response = await fetch(GEMINI_API_URL + GEMINI_API_KEY, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) { return res.status(500).json({ message: "Gemini returned no text." }); }

        res.json({ description: generatedText.trim() });
    } catch (error) { console.error("Gemini Generation Error:", error); res.status(500).json({ message: "Failed to generate description.", details: error.message }); }
});


// --- Start the Server ---
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});