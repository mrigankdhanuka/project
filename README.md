# QuickShop - E-commerce Application

A full-stack e-commerce application built with React, Node.js, Express, and Stripe for secure payments.

## Features

- 🛍️ Product browsing with search and filtering
- 🛒 Shopping cart management with persistent storage
- 💳 Secure Stripe checkout integration
- 📧 Email confirmations for successful orders
- 📱 Responsive design for all devices
- ⚡ Modern UI with smooth animations

## Tech Stack

**Frontend:**
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

**Backend:**
- Node.js with Express
- Stripe for payment processing
- Nodemailer for email notifications
- CORS for cross-origin requests

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Stripe account (for payment processing)

### Installation

1. Clone the repository
2. Install dependencies for all parts:
   ```bash
   npm run install:all
   ```

3. Set up environment variables:
   ```bash
   cd server
   cp .env.example .env
   ```
   
   Fill in your Stripe secret key in the `.env` file.

4. Start the development servers:
   ```bash
   npm run dev
   ```

This will start both the frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

## Stripe Test Mode

The application uses Stripe in test mode. Use these test card numbers:

- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- Use any future expiry date and any 3-digit CVC

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context for state management
│   │   ├── pages/       # Page components
│   │   └── types/       # TypeScript type definitions
├── server/          # Express backend
│   ├── index.js     # Main server file
│   └── .env.example # Environment variables template
└── package.json     # Root package.json with scripts
```

## Available Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:client` - Start only the frontend
- `npm run dev:server` - Start only the backend
- `npm run build` - Build the frontend for production
- `npm run install:all` - Install dependencies for all parts

## Features

### Product Management
- Mock product data with categories
- Search and filter functionality
- Responsive product grid

### Shopping Cart
- Add/remove items
- Update quantities
- Persistent cart storage
- Real-time totals

### Checkout Process
- Secure Stripe integration
- Order summary display
- Payment processing
- Success confirmation

### Email Notifications
- Automated order confirmations
- Test email setup with Ethereal
- Detailed order information

## Environment Variables

Create a `.env` file in the server directory:

```env
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
PORT=3001
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.