const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    collaborators: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true,
            },
            role: {
                type: String,
                enum: ['Collaborator', 'Viewer'],
                default: 'Viewer',
            },
        },
    ],
    isArchieved: {
        type: Boolean,
        default: false
    },
    file: {
        type: String,
        required: false
    },
},

{
    timestamps: true
}
);

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;