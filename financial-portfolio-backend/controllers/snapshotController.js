const db = require('../config/db');

exports.getAllSnapshots = (req, res) => {
  db.query('SELECT * FROM portfolio_snapshots', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addSnapshot = (req, res) => {
  const { snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer } = req.body;
  const sql = 'INSERT INTO portfolio_snapshots (snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Snapshot added', snapshotId: result.insertId });
  });
};