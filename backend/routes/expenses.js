const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get user's expenses
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.all(
      'SELECT * FROM expenses WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [userId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        res.json({ expenses: rows || [] });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new expense
router.post('/', authenticateToken, (req, res) => {
  try {
    const { title, amount, category } = req.body;
    const userId = req.user.userId;

    if (!title || !amount || !category) {
      return res.status(400).json({ error: 'Title, amount, and category are required' });
    }

    if (amount <= 0) {
      return res.status(400).json({ error: 'Amount must be positive' });
    }

    db.run(
      'INSERT INTO expenses (user_id, title, amount, category) VALUES (?, ?, ?, ?)',
      [userId, title, amount, category],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Failed to add expense' });
        }

        // Get the created expense
        db.get(
          'SELECT * FROM expenses WHERE id = ?',
          [this.lastID],
          (err, row) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to retrieve expense' });
            }

            res.status(201).json({
              message: 'Expense added successfully',
              expense: row
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get expense categories summary
router.get('/categories', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.all(
      `SELECT 
        category,
        SUM(amount) as total_amount,
        COUNT(*) as transaction_count
      FROM expenses 
      WHERE user_id = ? 
      GROUP BY category 
      ORDER BY total_amount DESC`,
      [userId],
      (err, rows) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Calculate percentages
        const totalAmount = rows.reduce((sum, row) => sum + row.total_amount, 0);
        const categories = rows.map(row => ({
          category: row.category,
          amount: row.total_amount,
          percentage: totalAmount > 0 ? Math.round((row.total_amount / totalAmount) * 100) : 0,
          transactionCount: row.transaction_count
        }));

        res.json({ categories, totalAmount });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's financial summary
router.get('/summary', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    // Get total expenses for current month
    db.get(
      `SELECT SUM(amount) as total_expenses 
       FROM expenses 
       WHERE user_id = ? 
       AND date >= date('now', 'start of month')`,
      [userId],
      (err, expenseRow) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        // Get total savings
        db.get(
          `SELECT SUM(current_amount) as total_savings 
           FROM savings_goals 
           WHERE user_id = ?`,
          [userId],
          (err, savingsRow) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            const totalExpenses = expenseRow?.total_expenses || 0;
            const totalSavings = savingsRow?.total_savings || 0;
            
            // Calculate monthly balance (demo: start with 12000)
            const monthlyBalance = 12000 - totalExpenses;

            res.json({
              monthlyBalance,
              totalExpenses,
              totalSavings
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