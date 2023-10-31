const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.models');
const Project = require('../models/project.models');
const dotenv = require('dotenv').config();

// General container
const authHelpers = {};


// @desc    Geneate token
authHelpers.generateToken = asyncHandler(({id}) => {
    if (typeof(id) !== 'object'){
        res.status(400);
        throw new Error('Object (id) is required to generate token');
    }

    const token = jwt.sign
    (
        {id},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );
    return token;
}); 

// @desc    Authenticate token
authHelpers.authenticateToken = asyncHandler(async (req, res, next) => {
        // Get the jwt access token from the request header
        const token = req.headers['authorization'].split('Bearer ')[1];

        if (!token) {
            res.status(401);
            throw new Error('Unauthorized');
        };

        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);

        // If token is invalid
        if (!decodedToken) {
            res.status(401);
            throw new Error('Unauthorized user, token invalid');
        }

        // If token is valid
        const user = await User.findById(decodedToken.id).select('-password');

        // If user not found
        if (!user) {
            res.status(404);
            throw new Error('User not found, please register');
        }

        

        // If user found, set req.user to user
        req.user = user;

        next();
});

// Middleware to check if the user is the project owner
authHelpers.isOwner = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        if (project.user.toString() === userId) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

authHelpers.isCollaborator = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is a collaborator (role === 'Collaborator')
        const isCollaborator = project.collaborators.some(collaborator => {
            return collaborator.user.toString() === userId && collaborator.role === 'Collaborator';
        });

        if (isCollaborator) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to check if the user is a viewer
authHelpers.isViewer = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is a viewer (role === 'Viewer')
        const isViewer = project.collaborators.some(collaborator => {
            return collaborator.user.toString() === userId && collaborator.role === 'Viewer';
        });

        if (isViewer) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Middleware to check if the user is permitted to edit
authHelpers.isPermittedToEdit = async (req, res, next) => {
    const projectId = req.params.id;
    const userId = req.user.id;

    try {
        const project = await Project.findById(projectId);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        // Check if the user is a collaborator (role === 'Collaborator') or the owner
        const isCollaborator = project.collaborators.some(collaborator => {
            return collaborator.user.toString() === userId && collaborator.role === 'Collaborator';
        });

        const isOwner = project.user.toString() === userId;

        if (isCollaborator || isOwner) {
            next();
        } else {
            return res.status(403).json({ message: 'Access denied' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}


// Middleware to check if the user is permitted to view
authHelpers.isPermittedToView = asyncHandler(async (req, res, next) => {
    const isOwner = await authHelpers.isOwner(req, res, next);
    const isCollaborator = await authHelpers.isCollaborator(req, res, next);
    const isViewer = await authHelpers.isViewer(req, res, next);

    if (isOwner || isCollaborator || isViewer) {
        next();
    } else {
        return res.status(403).json({ message: 'Access denied' });
    }
});

// Export container
module.exports = authHelpers;