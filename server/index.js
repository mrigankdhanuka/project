import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

// Mock product data
const products = [
  {
    id: '1',
    title: 'Premium Wireless Headphones',
    price: 299,
    imageURL: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'High-quality wireless headphones with noise cancellation and premium sound quality.',
    category: 'electronics'
  },
  {
    id: '2',
    title: 'Minimalist Watch',
    price: 199,
    imageURL: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Elegant minimalist watch with leather strap, perfect for any occasion.',
    category: 'accessories'
  },
  {
    id: '3',
    title: 'Organic Cotton T-Shirt',
    price: 45,
    imageURL: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Comfortable and sustainable organic cotton t-shirt in various colors.',
    category: 'clothing'
  },
  {
    id: '4',
    title: 'Modern Desk Lamp',
    price: 89,
    imageURL: 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Sleek modern desk lamp with adjustable brightness and USB charging port.',
    category: 'home'
  },
  {
    id: '5',
    title: 'Leather Backpack',
    price: 159,
    imageURL: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Handcrafted leather backpack with multiple compartments and laptop sleeve.',
    category: 'accessories'
  },
  {
    id: '6',
    title: 'Smart Fitness Tracker',
    price: 249,
    imageURL: 'https://images.pexels.com/photos/1553835/pexels-photo-1553835.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Advanced fitness tracker with heart rate monitoring and GPS.',
    category: 'electronics'
  },
  {
    id: '7',
    title: 'Ceramic Coffee Mug',
    price: 24,
    imageURL: 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Handmade ceramic coffee mug with unique glaze pattern.',
    category: 'home'
  },
  {
    id: '8',
    title: 'Wool Sweater',
    price: 129,
    imageURL: 'https://images.pexels.com/photos/1020585/pexels-photo-1020585.jpeg?auto=compress&cs=tinysrgb&w=800',
    description: 'Cozy wool sweater made from ethically sourced materials.',
    category: 'clothing'
  }
];

// Store for transaction logs (in production, use a proper database)
const transactionLogs = [];

// Configure nodemailer (using Ethereal for testing)
let transporter;

async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransporter({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    console.log('Test email account created:', testAccount.user);
  } catch (error) {
    console.error('Error creating test email account:', error);
  }
}

// Initialize email transporter
createTestAccount();

// Routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Create line items for Stripe
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/cart`,
      metadata: {
        orderData: JSON.stringify(items),
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Webhook to handle successful payments
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Log the transaction
    const transaction = {
      id: session.id,
      amount: session.amount_total / 100,
      currency: session.currency,
      customerEmail: session.customer_details?.email,
      items: JSON.parse(session.metadata.orderData || '[]'),
      timestamp: new Date().toISOString(),
    };
    
    transactionLogs.push(transaction);
    console.log('Transaction logged:', transaction);

    // Send confirmation email
    if (transporter && session.customer_details?.email) {
      try {
        const mailOptions = {
          from: '"QuickShop" <noreply@quickshop.com>',
          to: session.customer_details.email,
          subject: 'Order Confirmation - Thank you for your purchase!',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #2563eb; text-align: center;">Order Confirmation</h1>
              <p>Thank you for your purchase! Your order has been confirmed.</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3>Order Details:</h3>
                <p><strong>Order ID:</strong> ${session.id}</p>
                <p><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
              </div>

              <div style="background-color: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #059669;">Items Purchased:</h3>
                ${transaction.items.map(item => `
                  <div style="border-bottom: 1px solid #d1d5db; padding: 10px 0;">
                    <p><strong>${item.title}</strong></p>
                    <p>Quantity: ${item.quantity} × $${item.price} = $${(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                `).join('')}
              </div>

              <p>Your order will be processed within 1-2 business days. You'll receive tracking information once your order ships.</p>
              
              <p style="text-align: center; margin-top: 30px;">
                <a href="${req.headers.origin}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Continue Shopping</a>
              </p>

              <p style="text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px;">
                This is a demo email from QuickShop. Thank you for testing our application!
              </p>
            </div>
          `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Confirmation email sent:', nodemailer.getTestMessageUrl(info));
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }
  }

  res.json({ received: true });
});

// Get transaction logs (for demo purposes)
app.get('/api/transactions', (req, res) => {
  res.json(transactionLogs);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Frontend should connect to: http://localhost:${PORT}`);
});