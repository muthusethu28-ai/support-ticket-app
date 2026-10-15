const express = require('express');
const authRoutes = require('./auth.routes');
const ticketRoutes = require('./ticket.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ success: true, message: 'OK', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/tickets', ticketRoutes);

module.exports = router;
