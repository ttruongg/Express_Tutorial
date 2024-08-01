import mongoose, { Model, mongo, Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true,
    },
    displayName: {
        type: mongoose.Schema.Types.String
    },
    password: {
        type: mongoose.Schema.Types.String,
        require: true,
    }
});

export const User = mongoose.model("User", userSchema);