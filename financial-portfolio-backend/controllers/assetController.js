const db = require('../config/db.js');

exports.getAllAssets = (req, res) => {
  db.query('SELECT * FROM assets', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addAsset = (req, res) => {
  const { asset_type, asset_name, quantity, amount_invested, purchase_date, current_value } = req.body;
  const sql = 'INSERT INTO assets (asset_type, asset_name, quantity, amount_invested, purchase_date, current_value) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [asset_type, asset_name, quantity, amount_invested, purchase_date, current_value], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Asset added successfully', assetId: result.insertId });
  });
};

exports.updateAsset = (req, res) => {
  const { id } = req.params;
  const { current_value, amount_invested } = req.body;
  const sql = 'UPDATE assets SET current_value = ?, amount_invested = ? WHERE id = ?';
  db.query(sql, [current_value, amount_invested, id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Asset updated successfully' });
  });
};

exports.deleteAsset = (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM assets WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Asset deleted successfully' });
  });
};


exports.getAssetAllocation = (req, res) => {
  const sql = `
    SELECT asset_type, SUM(current_value) AS total
    FROM assets
    GROUP BY asset_type
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


