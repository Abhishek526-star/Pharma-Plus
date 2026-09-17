require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/error.middleware');

const app = express();
connectDB();


// Security & Parsing Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

const allowedOrigins = [
    process.env.CLIENT_URL,
    'https://pharmaplus-frontend.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
].filter(Boolean).map(origin => origin.trim().replace(/\/$/, ''));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.trim().replace(/\/$/, '');
        if (
            allowedOrigins.includes(cleanOrigin) ||
            cleanOrigin.endsWith('.vercel.app')
        ) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    credentials: true,
}));



// Standard JSON parsing for all other routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10000,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Health Check
app.get('/', (req, res) => {
    res.send('Online Pharmacy API is running...');
});

// API Routes
const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/category.routes');
const medicineRoutes = require('./routes/medicine.routes');
const cartRoutes = require('./routes/cart.routes');
const prescriptionRoutes = require('./routes/prescription.routes');
const reviewRoutes = require('./routes/review.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const adminRoutes = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.routes');


app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contact', contactRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on ${PORT}`);
    });
}

module.exports = app;