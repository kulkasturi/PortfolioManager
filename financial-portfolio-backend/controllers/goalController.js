const db = require('../config/db');

exports.getAllGoals = (req, res) => {
  db.query('SELECT * FROM goals', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.addGoal = (req, res) => {
  const { goal_name, target_amount, target_date } = req.body;
  const sql = 'INSERT INTO goals (goal_name, target_amount, target_date) VALUES (?, ?, ?)';
  db.query(sql, [goal_name, target_amount, target_date], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.status(201).json({ message: 'Goal added', goalId: result.insertId });
  });
};