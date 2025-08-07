// const db = require('../config/db');

// exports.getAllGoals = (req, res) => {
//   db.query('SELECT * FROM goals', (err, results) => {
//     if (err) return res.status(500).json({ error: err });
//     res.json(results);
//   });
// };

// exports.addGoal = (req, res) => {
//   const { goal_name, target_amount, target_date } = req.body;
//   const sql = 'INSERT INTO goals (goal_name, target_amount, target_date) VALUES (?, ?, ?)';
//   db.query(sql, [goal_name, target_amount, target_date], (err, result) => {
//     if (err) return res.status(500).json({ error: err });
//     res.status(201).json({ message: 'Goal added', goalId: result.insertId });
//   });
// };


// const db = require('../config/db');

// exports.getAllGoals = (req, res) => {
//   db.query('SELECT * FROM goals', (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// exports.addGoal = (req, res) => {
//   const { goal_name, target_amount, target_date } = req.body;

//   // 1. First, insert the new goal into the database
//   const insertGoalSql = 'INSERT INTO goals (goal_name, target_amount, target_date) VALUES (?, ?, ?)';
//   db.query(insertGoalSql, [goal_name, target_amount, target_date], (err, result) => {
//     if (err) {
//       // Handle database insertion error
//       console.error('Error inserting goal:', err);
//       return res.status(500).json({ error: err.message });
//     }

//     const newGoalId = result.insertId; // Get the ID of the newly inserted goal

//     // 2. After successfully adding the goal, calculate the portfolio's total current value
//     const getTotalAssetValueSql = `
//       SELECT SUM(current_value) AS total_current_value
//       FROM assets
//     `;

//     db.query(getTotalAssetValueSql, (err, assetResults) => {
//       if (err) {
//         // Handle error during asset value calculation
//         console.error('Error fetching total asset value:', err);
//         return res.status(500).json({ error: err.message });
//       }

//       // Ensure totalCurrentAssetValue is explicitly a number.
//       // Use parseFloat to convert from potential string and handle || 0 for null/undefined.
//       const totalCurrentAssetValue = parseFloat(assetResults[0].total_current_value) || 0;
//       const targetAmountFloat = parseFloat(target_amount); // Convert target_amount to a float for comparison

//       let isAchievable = false;
//       let amountNeeded = 0;

//       // 3. Compare total asset value with the goal's target amount
//       if (totalCurrentAssetValue >= targetAmountFloat) {
//         isAchievable = true;
//       } else {
//         amountNeeded = targetAmountFloat - totalCurrentAssetValue;
//       }

//       // 4. Return an enhanced JSON response with the goal details and achievability status
//       res.status(201).json({
//         message: 'Goal added successfully',
//         goalId: newGoalId,
//         goalAchievability: {
//           isAchievable: isAchievable,
//           currentPortfolioValue: totalCurrentAssetValue, // This is now guaranteed to be a number
//           targetAmount: targetAmountFloat,
//           amountNeeded: amountNeeded.toFixed(2) // This will also be a number
//         }
//       });
//     });
//   });
// };
// working well by H



const db = require('../config/db');

exports.getAllGoals = (req, res) => {
  db.query('SELECT * FROM goals', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.addGoal = (req, res) => {
  const { goal_name, target_amount, target_date } = req.body;
  const targetAmountFloat = parseFloat(target_amount);

  // Step 1: Fetch total asset value
  const getTotalAssetValueSql = `SELECT SUM(current_value) AS total_current_value FROM assets`;
  db.query(getTotalAssetValueSql, (err, assetResults) => {
    if (err) {
      console.error('Error fetching asset value:', err);
      return res.status(500).json({ error: err.message });
    }

    const totalCurrentAssetValue = parseFloat(assetResults[0].total_current_value) || 0;

    // Step 2: Fetch total existing goals
    const getExistingGoalsSql = `SELECT SUM(target_amount) AS total_existing_goals FROM goals`;
    db.query(getExistingGoalsSql, (err, goalResults) => {
      if (err) {
        console.error('Error fetching existing goals:', err);
        return res.status(500).json({ error: err.message });
      }

      const totalExistingGoals = parseFloat(goalResults[0].total_existing_goals) || 0;
      const combinedTarget = totalExistingGoals + targetAmountFloat;

      // Step 3: Decide if achievable
      let isAchievable = false;
      let amountNeeded = 0;

      if (totalCurrentAssetValue >= combinedTarget) {
        isAchievable = true;
      } else {
        amountNeeded = combinedTarget - totalCurrentAssetValue;
      }

      // Step 4: Now insert the goal
      const insertGoalSql = 'INSERT INTO goals (goal_name, target_amount, target_date) VALUES (?, ?, ?)';
      db.query(insertGoalSql, [goal_name, target_amount, target_date], (err, result) => {
        if (err) {
          console.error('Error inserting goal:', err);
          return res.status(500).json({ error: err.message });
        }

        const newGoalId = result.insertId;

        res.status(201).json({
          message: 'Goal added successfully',
          goalId: newGoalId,
          goalAchievability: {
            isAchievable,
            currentPortfolioValue: totalCurrentAssetValue,
            totalExistingGoals,
            thisGoal: targetAmountFloat,
            combinedTarget,
            amountNeeded: amountNeeded.toFixed(2)
          }
        });
      });
    });
  });
};

// DELETE a goal (mark as achieved)
exports.deleteGoal = (req, res) => {
  const goalId = req.params.id;

  const sql = 'DELETE FROM goals WHERE id = ?';
  db.query(sql, [goalId], (err, result) => {
    if (err) {
      console.error('Error deleting goal:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal marked as achieved and removed' });
  });
};


// DELETE a goal by ID (mark as achieved)
exports.deleteGoal = (req, res) => {
  const goalId = req.params.id;

  const sql = 'DELETE FROM goals WHERE id = ?';
  db.query(sql, [goalId], (err, result) => {
    if (err) {
      console.error('Error deleting goal:', err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Goal not found' });
    }

    res.json({ message: 'Goal marked as achieved and removed' });
  });
};
