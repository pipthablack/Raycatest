const authHelpers = require('../middleware/authHandler');
const express = require('express');
const { createProject, updateProject, addCollab, getProjects, archieveProject } = require('../controllers/project.controllers');
const multer = require('multer');

const upload = multer({
    dest: 'uploads/'
});
const router = express.Router();

router.post('/create', authHelpers.authenticateToken, upload.single('file'), createProject);
router.put('/update/:id', authHelpers.authenticateToken,authHelpers.isPermittedToEdit, updateProject)
router.get('/all', authHelpers.authenticateToken, getProjects)
router.put('/archieve/:id', authHelpers.authenticateToken, authHelpers.isOwner, archieveProject)

// Add collaborator
router.put('/invite/:id', authHelpers.authenticateToken, authHelpers.isOwner, addCollab)
module.exports = router;