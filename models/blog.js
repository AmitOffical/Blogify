const { Schema, model, default: mongoose} = require("mongoose");

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",    
    }
},{ timestamps: true });

const Blog = model("blog", blogSchema);
module.exports = Blog;