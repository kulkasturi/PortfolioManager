const express = require('express');
const portfolioController = require('../controllers/portfolioController');

const router = express.Router();

// GET /api/portfolio - Get all portfolio items
router.get('/', portfolioController.getAllItems);

// GET /api/portfolio/:id - Get specific portfolio item
router.get('/:id', portfolioController.getItemById);

// POST /api/portfolio - Add new portfolio item
router.post('/', portfolioController.createItem);

// PUT /api/portfolio/:id - Update portfolio item
router.put('/:id', portfolioController.updateItem);

// DELETE /api/portfolio/:id - Delete portfolio item
router.delete('/:id', portfolioController.deleteItem);

module.exports = router;