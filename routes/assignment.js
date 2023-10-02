const express = require('express');
const { body } = require('express-validator');
const { checkAssignmentRouter } = require('../middleware/is-auth');
const assignmentController = require('../controllers/assignment');

const router = express.Router();

//Get All assignments
router.get('/assignments', checkAssignmentRouter, assignmentController.getAssignments);

//Post assignments
router.post('/assignments', checkAssignmentRouter, assignmentController.postAssignment);

//Get Specific Assignment
router.get('/assignments/:id', checkAssignmentRouter, assignmentController.getAssignment);

//Delete Assignment
router.delete('/assignments/:id', checkAssignmentRouter, assignmentController.deleteAssignment);

//Delete Assignment
router.put('/assignments/:id', checkAssignmentRouter, assignmentController.updateAssignment);

module.exports = router;