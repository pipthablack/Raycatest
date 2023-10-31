const Project = require('../models/project.models');
const User = require('../models/user.models');
const asyncHandler = require('express-async-handler');
const uploadImage = require('../config/cloudinary');
const fs = require('fs');

const projectController = {};

projectController.createProject = asyncHandler(async (req, res) => {
    const user = req.user.id;
    const file = req.file;
    var imageUrl = '';
    var project;

    const { name, description } = req.body;
    // Sanity check request
    if (!name || !description) {
        res.status(400);
        throw new Error('Please add a title and description');
    }

    if (file){
        imageUrl = await uploadImage(file.path);
        project = await Project.create({ name, description, user, file:imageUrl });
    } else{
        project = await Project.create({ name, description, user });
    }
    
    fs.unlinkSync(file.path);

    

    if (!project) {
        res.status(400);
        throw new Error('Project not created');
    }

    res.status(201).json({
        success: true,
        data: project,
    });
});

projectController.getProjects = asyncHandler(async (req, res) => {
    const user = req.user.id;

    const projects = await Project.find({ user });

    if (!projects) {
        res.status(400);
        throw new Error('No projects found');
    }

    // Filter by projects where isArchieved is true
    const unArchivedProjects = projects.filter((project) => project.isArchieved === false);


    res.status(200).json({
        success: true,
        count: projects.length,
        data: unArchivedProjects,
    }
    );

});

projectController.archieveProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;

    const project = await Project.findByIdAndUpdate(projectId, { isArchieved: true }, { new: true });

    if (!project) {
        res.status(400);
        throw new Error('Project not archived');
    }

    res.status(200).json ({
        success: true,
        data: "Successfully archived project",
    })
})


projectController.updateProject = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const { name, description } = req.body;

    const project = await Project.findByIdAndUpdate(projectId, { name, description }, { new: true });

    if (!project) {
        res.status(400);
        throw new Error('Project not updated');
    }

    res.status(200).json ({
        success: true,
        data: project,
    });
});

projectController.addCollab = asyncHandler(async (req, res) => {
    const projectId = req.params.id;
    const { email } = req.body;
    const { collabType } = req.body;
    const collabOptions = ['Viewer', 'Collaborator'];
    
    if (!collabOptions.includes(collabType)) {
        res.status(400);
        throw new Error('Collab type not valid');
    }

    // Find if user exists
    const user = await User.findOne({ email })
    if (!user) {
        res.status(400);
        throw new Error('User not found');
    }

    // Check if user is already a collaborator
    const project = await Project.findById(projectId);
    const collaborator = project.collaborators.find(
        (collab) => collab.user.toString() === user.id.toString()
    );

    if (collaborator) {
        if (collaborator.role === collabType) {
            res.status(400);
            throw new Error('User is already a collaborator on this level');
        }
    }

    if (collaborator){
        // Remove collaborator from project
        project.collaborators = project.collaborators.filter(
            (collab) => collab.user.toString() !== user.id.toString()
        );
        await project.save();
    }

    // Now push new user as a collaborator
    const colabOject = {
        user: user.id,
        role: collabType,
    } 

    project.collaborators.push(colabOject);
    const projectUpdated = await project.save();

    res.status(200).json ({
        success: true,
        data: projectUpdated,
    })

})




module.exports = projectController;
