require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');   // ✅ Required

const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const { errorHandler } = require('./middleware/errorHandler');


connectDB();

const app = express();
app.use(express.json());
app.use(helmet());
app.use(cors({
  origin: "https://dev-blog-neon-eight.vercel.app", // 👈 your Vercel frontend domain
  credentials: true
}));

const morgan = require('morgan');
app.use(morgan('dev'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);

app.get('/', (req, res) => res.send('Dev Blog API running'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
