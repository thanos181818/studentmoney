const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's savings goals
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.all(
      'SELECT * FROM savings_goals WHERE user_id = ? ORDER BY created_at DESC',
      [userId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ savingsGoals: rows || [] });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new savings goal
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, target, category } = req.body;
    const userId = req.user.userId;

    if (!title || !target || !category) {
      return res.status(400).json({ error: 'Title, target amount, and category are required' });
    }

    if (target <= 0) {
      return res.status(400).json({ error: 'Target amount must be positive' });
    }

    db.run(
      'INSERT INTO savings_goals (user_id, title, target_amount, category) VALUES (?, ?, ?, ?)',
      [userId, title, target, category],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to create savings goal' });
        }

        // Get the created goal
        db.get(
          'SELECT * FROM savings_goals WHERE id = ?',
          [this.lastID],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to retrieve savings goal' });
            }

            res.status(201).json({
              message: 'Savings goal created successfully',
              savingsGoal: row
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add money to savings goal
router.post('/:goalId/add-money', authenticateToken, (req, res) => {
  try {
    const { amount } = req.body;
    const { goalId } = req.params;
    const userId = req.user.userId;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    // First check if the goal belongs to the user
    db.get(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId],
      (err, goal) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!goal) {
          return res.status(404).json({ error: 'Savings goal not found' });
        }

        // Calculate new amount (don't exceed target)
        const newAmount = Math.min(goal.current_amount + amount, goal.target_amount);

        db.run(
          'UPDATE savings_goals SET current_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [newAmount, goalId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to update savings goal' });
            }

            // Get updated goal
            db.get(
              'SELECT * FROM savings_goals WHERE id = ?',
              [goalId],
              (err, updatedGoal) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to retrieve updated goal' });
                }

                res.json({
                  message: 'Money added successfully',
                  savingsGoal: updatedGoal,
                  amountAdded: newAmount - goal.current_amount
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update savings goal target
router.put('/:goalId', authenticateToken, (req, res) => {
  try {
    const { target } = req.body;
    const { goalId } = req.params;
    const userId = req.user.userId;

    if (!target || target <= 0) {
      return res.status(400).json({ error: 'Target amount must be positive' });
    }

    // First check if the goal belongs to the user and get current target
    db.get(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId],
      (err, goal) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!goal) {
          return res.status(404).json({ error: 'Savings goal not found' });
        }

        if (target < goal.target_amount) {
          return res.status(400).json({ error: 'New target must be greater than or equal to current target' });
        }

        db.run(
          'UPDATE savings_goals SET target_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [target, goalId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to update savings goal' });
            }

            // Get updated goal
            db.get(
              'SELECT * FROM savings_goals WHERE id = ?',
              [goalId],
              (err, updatedGoal) => {
                if (err) {
                  return res.status(500).json({ error: 'Failed to retrieve updated goal' });
                }

                res.json({
                  message: 'Savings goal updated successfully',
                  savingsGoal: updatedGoal
                });
              }
            );
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete savings goal
router.delete('/:goalId', authenticateToken, (req, res) => {
  try {
    const { goalId } = req.params;
    const userId = req.user.userId;

    // First check if the goal belongs to the user
    db.get(
      'SELECT * FROM savings_goals WHERE id = ? AND user_id = ?',
      [goalId, userId],
      (err, goal) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!goal) {
          return res.status(404).json({ error: 'Savings goal not found' });
        }

        db.run(
          'DELETE FROM savings_goals WHERE id = ?',
          [goalId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to delete savings goal' });
            }

            res.json({
              message: 'Savings goal deleted successfully'
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;