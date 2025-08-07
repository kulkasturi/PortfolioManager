// const db = require('../config/db');

// exports.getAllTransactions = (req, res) => {
//   const sql = `
//     SELECT t.id, t.type, t.transaction_date, t.quantity, t.amount, t.notes,
//            a.asset_name
//     FROM transactions t
//     JOIN assets a ON t.asset_id = a.id
//     ORDER BY t.transaction_date DESC
//   `;

//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };


// exports.addTransaction = async (req, res) => {
//   const { asset_type, asset_name, quantity, amount, transaction_date, type } = req.body;

//   try {
//     const [existing] = await db.query(
//       'SELECT * FROM assets WHERE asset_name = ? AND asset_type = ?',
//       [asset_name, asset_type]
//     );

//     let asset_id;

//     if (type === 'Buy') {
//       if (existing.length > 0) {
//         const asset = existing[0];
//         const newQty = parseFloat(asset.quantity) + parseFloat(quantity);
//         const newAmt = parseFloat(asset.amount_invested) + parseFloat(amount);

//         await db.query(
//           'UPDATE assets SET quantity = ?, amount_invested = ? WHERE id = ?',
//           [newQty, newAmt, asset.id]
//         );

//         asset_id = asset.id;
//       } else {
//         const [insert] = await db.query(
//           'INSERT INTO assets (asset_type, asset_name, quantity, amount_invested, purchase_date, current_value) VALUES (?, ?, ?, ?, ?, ?)',
//           [asset_type, asset_name, quantity, amount, transaction_date, amount]
//         );
//         asset_id = insert.insertId;
//       }
//     } else if (type === 'Sell') {
//       if (existing.length === 0) return res.status(404).json({ message: "Asset not found" });

//       const asset = existing[0];
//       const newQty = parseFloat(asset.quantity) - parseFloat(quantity);
//       const newAmt = (asset.amount_invested / asset.quantity) * newQty;

//       if (newQty < 0) return res.status(400).json({ message: "Cannot sell more than owned" });

//       await db.query(
//         'UPDATE assets SET quantity = ?, amount_invested = ? WHERE id = ?',
//         [newQty, newAmt, asset.id]
//       );

//       asset_id = asset.id;
//     }

//     // ✅ Corrected transaction insert with all required fields
//     await db.query(
//       `INSERT INTO transactions (asset_id, asset_type, asset_name, type, transaction_date, quantity, amount)
//        VALUES (?, ?, ?, ?, ?, ?, ?)`,
//       [asset_id, asset_type, asset_name, type, transaction_date, quantity, amount]
//     );

//     res.json({ message: 'Transaction processed successfully.' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Server error', details: err.message });
//   }
// };


const db = require('../config/db');

// GET all transactions
exports.getAllTransactions = (req, res) => {
  const sql = `
    SELECT t.id, t.type, t.transaction_date, t.quantity, t.amount, t.notes,
           t.asset_name, t.asset_type
    FROM transactions t
    ORDER BY t.transaction_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
// ADD a transaction (Buy or Sell)
// ADD a transaction (Buy or Sell)
exports.addTransaction = (req, res) => {
  const { asset_type, asset_name, quantity, amount, transaction_date, type, notes } = req.body;

  const getAssetSql = 'SELECT * FROM assets WHERE asset_name = ? AND asset_type = ?';
  db.query(getAssetSql, [asset_name, asset_type], (err, existingResults) => {
    if (err) return res.status(500).json({ error: err });

    let asset = existingResults[0];
    let asset_id;

    if (type === 'Buy') {
      if (asset) {
        const newQty = parseFloat(asset.quantity) + parseFloat(quantity || 0);
        const newAmt = parseFloat(asset.amount_invested) + parseFloat(amount);

        const updateSql = 'UPDATE assets SET quantity = ?, amount_invested = ? WHERE id = ?';
        db.query(updateSql, [newQty, newAmt, asset.id], (err) => {
          if (err) return res.status(500).json({ error: err });

          asset_id = asset.id;
          insertTransaction(asset_id);
        });
      } else {
        const insertAssetSql = `
          INSERT INTO assets (asset_type, asset_name, quantity, amount_invested, purchase_date, current_value)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(insertAssetSql, [asset_type, asset_name, quantity || 0, amount, transaction_date, amount], (err, result) => {
          if (err) return res.status(500).json({ error: err });

          asset_id = result.insertId;
          insertTransaction(asset_id);
        });
      }

    } else if (type === 'Sell') {
      if (!asset) return res.status(404).json({ message: "Asset not found" });

      const ownedQty = parseFloat(asset.quantity);
      const ownedAmt = parseFloat(asset.amount_invested);

      if (['Stock', 'Mutual Fund', 'Gold'].includes(asset_type)) {
        const sellQty = parseFloat(quantity);
        if (sellQty > ownedQty) return res.status(400).json({ message: "Not enough units to sell" });

        const newQty = ownedQty - sellQty;
        const newAmt = (ownedAmt / ownedQty) * newQty;

        const updateSql = 'UPDATE assets SET quantity = ?, amount_invested = ? WHERE id = ?';
        db.query(updateSql, [newQty, newAmt, asset.id], (err) => {
          if (err) return res.status(500).json({ error: err });

          asset_id = asset.id;
          insertTransaction(asset_id);
        });

      } else if (asset_type === 'FD') {
        // FD is sold in full (broken)
        const updateSql = 'UPDATE assets SET quantity = 0, amount_invested = 0 WHERE id = ?';
        db.query(updateSql, [asset.id], (err) => {
          if (err) return res.status(500).json({ error: err });

          asset_id = asset.id;
          insertTransaction(asset_id);
        });
      }
    }

    function insertTransaction(asset_id) {
      const insertTxnSql = `
        INSERT INTO transactions (asset_id, asset_type, asset_name, type, transaction_date, quantity, amount, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      db.query(insertTxnSql, [asset_id, asset_type, asset_name, type, transaction_date, quantity || null, amount, notes || null], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Transaction processed successfully.' });
      });
    }
  });
};



// SELL an asset
exports.sellAsset = (req, res) => {
  const { asset_type, asset_name, quantity, amount, transaction_date, notes } = req.body;

  const getAssetSql = 'SELECT * FROM assets WHERE asset_name = ? AND asset_type = ?';
  db.query(getAssetSql, [asset_name, asset_type], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ message: "Asset not found" });

    const asset = results[0];
    const asset_id = asset.id;
    const ownedQty = parseFloat(asset.quantity);
    const ownedAmt = parseFloat(asset.amount_invested);
    const sellQty = parseFloat(quantity);
    const sellAmt = parseFloat(amount);

    if (['Stock', 'Mutual Fund', 'Gold'].includes(asset_type)) {
      if (sellQty > ownedQty) return res.status(400).json({ message: "Not enough quantity to sell" });

      const newQty = ownedQty - sellQty;

      // Proportional reduction in invested amount
      const avgPricePerUnit = ownedAmt / ownedQty;
      const amountReduced = avgPricePerUnit * sellQty;
      const newAmt = ownedAmt - amountReduced;

      const updateSql = 'UPDATE assets SET quantity = ?, amount_invested = ? WHERE id = ?';
      db.query(updateSql, [newQty, newAmt, asset_id], (err) => {
        if (err) return res.status(500).json({ error: err });

        insertSellTransaction();
      });

    } else if (asset_type === 'FD') {
      // Sell full FD = break it
      const updateSql = 'UPDATE assets SET quantity = 0, amount_invested = 0 WHERE id = ?';
      db.query(updateSql, [asset_id], (err) => {
        if (err) return res.status(500).json({ error: err });

        insertSellTransaction();
      });
    }

    function insertSellTransaction() {
      const insertTxnSql = `
        INSERT INTO transactions (asset_id, asset_type, asset_name, type, transaction_date, quantity, amount, notes)
        VALUES (?, ?, ?, 'Sell', ?, ?, ?, ?)
      `;
      db.query(insertTxnSql, [asset_id, asset_type, asset_name, transaction_date, quantity || null, amount, notes || null], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Sell transaction completed successfully.' });
      });
    }
  });
};
