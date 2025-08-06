const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController.js');

router.get('/', assetController.getAllAssets);
router.post('/', assetController.addAsset);
router.put('/:id', assetController.updateAsset);
router.delete('/:id', assetController.deleteAsset);
router.get('/allocation', assetController.getAssetAllocation);

module.exports = router;