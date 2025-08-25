require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const { errorHandler } = require('./middleware/errorHandler');

connectDB();

const app = express();

// Security & parsing middlewares
app.use(express.json());
app.use(helmet());

// ✅ Configure CORS to allow your Vercel frontend
app.use(cors({
  origin: "https://dev-blog-neon-eight.vercel.app", // 👈 replace with your actual Vercel domain
  credentials: true
}));

// Request logging
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Root
app.get('/', (req, res) => res.send('Dev Blog API running'));

// Error handler
app.use(errorHandler);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
