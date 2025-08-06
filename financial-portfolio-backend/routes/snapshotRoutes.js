const express = require('express');
const router = express.Router();
const snapshotController = require('../controllers/snapshotController');

router.get('/', snapshotController.getAllSnapshots);
router.post('/', snapshotController.addSnapshot);

module.exports = router;