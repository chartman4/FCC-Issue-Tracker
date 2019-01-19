const mongoose = require("mongoose");
const Project = require("./project");

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
        open: { type: Boolean, default: true },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project"
        }
    }
);

// before removing issue, remove issue from project's list of issues
issueSchema.pre("remove", async function (next) {
    try {
        //find a project
        let project = await Project.findById(this.project);
        // remove the id of the message from their messages list
        project.issues.remove(this.id);
        //save that user
        await project.save();
        return next();
    } catch (err) {
        return next(err);

    }
})


const Issue = mongoose.model("Issue", issueSchema);
module.exports = Issue;