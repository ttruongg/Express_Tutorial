import mongoose, { Schema } from "mongoose";

const discordUserSchema = new Schema({
    username: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true,
    },
    discordId: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true
    }
});

export const DiscordUser = mongoose.model("DiscordUser", discordUserSchema);