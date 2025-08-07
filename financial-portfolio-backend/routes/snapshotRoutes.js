// const express = require('express');
// const router = express.Router();
// const snapshotController = require('../controllers/snapshotController');

// router.get('/', snapshotController.getAllSnapshots);
// router.post('/', snapshotController.addSnapshot);

// module.exports = router;



const express = require('express');
const router = express.Router();
const snapshotController = require('../controllers/snapshotController');

// Middleware to validate snapshot_date for POST requests
const validateSnapshotDate = (req, res, next) => {
  const { snapshot_date } = req.body;
  if (!snapshot_date || isNaN(Date.parse(snapshot_date))) {
    return res.status(400).json({ error: 'Invalid or missing snapshot_date' });
  }
  next();
};

router.get('/', snapshotController.getAllSnapshots);
router.post('/', validateSnapshotDate, snapshotController.addSnapshot);

module.exports = router;

