const db = require('../config/db');

exports.getAllTransactions = (req, res) => {
  const sql = `
    SELECT t.id, t.type, t.transaction_date, t.quantity, t.amount, t.notes,
           a.asset_name
    FROM transactions t
    JOIN assets a ON t.asset_id = a.id
    ORDER BY t.transaction_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};


exports.addTransaction = (req, res) => {
  const { asset_id, type, transaction_date, quantity, amount, notes } = req.body;
  const sql = 'INSERT INTO transactions (asset_id, type, transaction_date, quantity, amount, notes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [asset_id, type, transaction_date, quantity, amount, notes], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Transaction recorded', transactionId: result.insertId });
  });
};