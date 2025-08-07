
//kasturi
// const db = require('../config/db');

// exports.getAllSnapshots = (req, res) => {
//   db.query('SELECT * FROM portfolio_snapshots', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// exports.addSnapshot = (req, res) => {
//   const { snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer } = req.body;
//   const sql = 'INSERT INTO portfolio_snapshots (snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer) VALUES (?, ?, ?, ?, ?, ?)';
//   db.query(sql, [snapshot_date, total_investment, total_current_value, todays_gain_loss, best_performer, worst_performer], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({ message: 'Snapshot added', snapshotId: result.insertId });
//   });
// };



const db = require('../config/db');

exports.getAllSnapshots = (req, res) => {
  db.query('SELECT * FROM portfolio_snapshots', (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
};

exports.addSnapshot = (req, res) => {
  const { snapshot_date } = req.body;

  if (!snapshot_date || isNaN(Date.parse(snapshot_date))) {
    return res.status(400).json({ error: 'Invalid snapshot_date' });
  }

  db.query('SELECT id, asset_name, amount_invested, current_value FROM assets', (err, assets) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!assets.length) {
      return res.status(400).json({ error: 'No assets found to create snapshot' });
    }

    let total_investment = 0;
    let total_current_value = 0;
    let best_performer = null;
    let worst_performer = null;
    let best_performance = -Infinity;
    let worst_performance = Infinity;

    assets.forEach(asset => {
      const invested = Number(asset.amount_invested);
      const current = Number(asset.current_value);
      total_investment += invested;
      total_current_value += current;

      const performance = invested ? (current - invested) / invested : 0;

      if (performance > best_performance) {
        best_performance = performance;
        best_performer = asset.asset_name;
      }

      if (performance < worst_performance) {
        worst_performance = performance;
        worst_performer = asset.asset_name;
      }
    });

    const sellQuery = `
      SELECT t.quantity, t.amount, a.amount_invested / a.quantity AS purchase_price
      FROM transactions t
      JOIN assets a ON t.asset_id = a.id
      WHERE t.type = 'Sell' AND t.transaction_date = ?
    `;

    db.query(sellQuery, [snapshot_date], (err, sellTransactions) => {
      if (err) return res.status(500).json({ error: err.message });

      let sell_profit = 0;
      sellTransactions.forEach(tx => {
        const sell_price_per_unit = tx.amount / tx.quantity;
        sell_profit += (sell_price_per_unit - tx.purchase_price) * tx.quantity;
      });

      const prevQuery = `
        SELECT total_current_value
        FROM portfolio_snapshots
        WHERE snapshot_date < ?
        ORDER BY snapshot_date DESC
        LIMIT 1
      `;

      db.query(prevQuery, [snapshot_date], (err, prevSnapshot) => {
        if (err) return res.status(500).json({ error: err.message });

        const previous_value = prevSnapshot.length
          ? prevSnapshot[0].total_current_value
          : total_investment;

        const todays_gain_loss = (total_current_value + sell_profit) - previous_value;

        const insertQuery = `
          INSERT INTO portfolio_snapshots (
            snapshot_date,
            total_investment,
            total_current_value,
            todays_gain_loss,
            best_performer,
            worst_performer
          ) VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [
            snapshot_date,
            total_investment,
            total_current_value,
            todays_gain_loss,
            best_performer,
            worst_performer,
          ],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            res.status(201).json({
              message: 'Snapshot added',
              snapshotId: result.insertId,
            });
          }
        );
      });
    });
  });
};