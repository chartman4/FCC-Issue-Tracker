const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    projectname: {
        type: String,
        required: true,
        unique: true
    },
    issues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Issue"
        }
    ]
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;