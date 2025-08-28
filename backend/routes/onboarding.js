const express = require('express');
const { db } = require('../database/init');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Save onboarding data
router.post('/save', authenticateToken, (req, res) => {
  try {
    const { goals, upiApp } = req.body;
    const userId = req.user.userId;

    // Convert goals array to JSON string
    const goalsJson = JSON.stringify(goals || []);

    // Check if onboarding data already exists
    db.get('SELECT id FROM user_onboarding WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (row) {
        // Update existing onboarding data
        db.run(
          'UPDATE user_onboarding SET goals = ?, upi_app = ?, completed_at = CURRENT_TIMESTAMP WHERE user_id = ?',
          [goalsJson, upiApp, userId],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to update onboarding data' });
            }
            res.json({ message: 'Onboarding data updated successfully' });
          }
        );
      } else {
        // Insert new onboarding data
        db.run(
          'INSERT INTO user_onboarding (user_id, goals, upi_app) VALUES (?, ?, ?)',
          [userId, goalsJson, upiApp],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Failed to save onboarding data' });
            }
            res.json({ message: 'Onboarding data saved successfully' });
          }
        );
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get onboarding data
router.get('/data', authenticateToken, (req, res) => {
  try {
    const userId = req.user.userId;

    db.get('SELECT * FROM user_onboarding WHERE user_id = ?', [userId], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.json({ onboarding: null });
      }

      res.json({
        onboarding: {
          goals: JSON.parse(row.goals || '[]'),
          upiApp: row.upi_app,
          completedAt: row.completed_at
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;