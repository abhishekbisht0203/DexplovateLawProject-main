const express = require('express');
const { Case } = require('../models/Case');
const verifyUser = require('../middleware/verifyUser');

const router = express.Router();

/**
 * @route GET /api/cases
 * @description Get all cases
 * @access Private
 */
router.get('/', verifyUser, async (req, res) => {
  try {
    const cases = await Case.getAll();
    res.json({ success: true, data: cases });
  } catch (error) {
    console.error('Error fetching cases:', error);
    res.status(500).json({ success: false, message: 'Server error fetching cases' });
  }
});

/**
 * @route GET /api/cases/:id
 * @description Get a single case by ID
 * @access Private
 */
router.get('/:id', verifyUser, async (req, res) => {
  try {
    const { id } = req.params;
    const caseItem = await Case.findById(id);

    if (!caseItem) {
      return res.status(404).json({ success: false, message: 'Case not found' });
    }

    res.json({ success: true, data: caseItem });
  } catch (error) {
    console.error('Error fetching case by ID:', error);
    res.status(500).json({ success: false, message: 'Server error fetching case' });
  }
});

/**
 * @route PUT /api/cases/:id
 * @description Update a case by ID
 * @access Private
 */
router.put('/:id', verifyUser, async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCase = await Case.update(id, req.body);

    if (!updatedCase) {
      return res.status(404).json({ success: false, message: 'Case not found or not updated' });
    }

    res.json({ success: true, message: 'Case updated successfully', data: updatedCase });
  } catch (error) {
    console.error('Error updating case:', error);
    res.status(500).json({ success: false, message: 'Server error updating case' });
  }
});

/**
 * @route DELETE /api/cases/:id
 * @description Delete a case by ID
 * @access Private
 */
router.delete('/:id', verifyUser, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCase = await Case.delete(id);

    if (!deletedCase) {
      return res.status(404).json({ success: false, message: 'Case not found or not deleted' });
    }

    res.json({ success: true, message: 'Case deleted successfully', data: deletedCase });
  } catch (error) {
    console.error('Error deleting case:', error);
    res.status(500).json({ success: false, message: 'Server error deleting case' });
  }
});

module.exports = router;
