const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get('/', transactionController.getAllTransactions);
router.post('/add', transactionController.addTransaction);
router.post('/sell', transactionController.sellAsset);


module.exports = router;