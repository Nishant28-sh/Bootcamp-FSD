require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/UserRoutes');

const app = express();
const PORT = process.env.PORT || 8888;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.json({ msg: 'Backend is running fine', status: 'ok' });
});

// Routes
app.use('/pages', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
