require('dotenv').config();

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

console.log('Loaded Stripe key:', process.env.STRIPE_SECRET_KEY); // TEMP DEBUG

module.exports = stripe;
