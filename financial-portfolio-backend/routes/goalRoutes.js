const express = require('express');
const router = express.Router();
const goalController = require('../controllers/goalController');

router.get('/', goalController.getAllGoals);
router.post('/', goalController.addGoal);
router.delete('/:id', goalController.deleteGoal);

module.exports = router;