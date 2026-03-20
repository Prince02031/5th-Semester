const express = require('express');

const router = express.Router();
const {
  createCollaborationRequest,
  getCollaborationRequests,
  getCollaborationRequest,
  acceptCollaborationRequest,
  rejectCollaborationRequest,
  updateCollaborationStatus,
  updateMilestone,
  deleteCollaborationRequest
} = require('../controllers/collaborationController');

// GET all collaboration requests
router.get('/', getCollaborationRequests)

// GET a single collaboration request
router.get('/:id', getCollaborationRequest)

// POST a new collaboration request
router.post('/', createCollaborationRequest)

// POST accept a collaboration request
router.post('/:id/accept', acceptCollaborationRequest)

// POST reject a collaboration request
router.post('/:id/reject', rejectCollaborationRequest)

// PATCH update collaboration status
router.patch('/:id/status', updateCollaborationStatus)

// PATCH update milestone
router.patch('/:id/milestones/:milestoneIndex', updateMilestone)

// DELETE a collaboration request
router.delete('/:id', deleteCollaborationRequest)

module.exports = router;
