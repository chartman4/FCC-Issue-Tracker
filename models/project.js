const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },

        text: {
            type: String,
            required: true,
            maxLength: 160
        },
        created_by: { type: String, required: true },
        assigned_to: String,
        status_text: String,
        created_on: { type: Date, default: Date.now },
        updated_on: Date,
        open: { type: Boolean, default: true }
    }
);

const projectSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        issues: [issueSchema]
    }
)

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;