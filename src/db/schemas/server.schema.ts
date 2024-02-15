import mongoose, { Schema } from "mongoose";

const serverSchema = new Schema({
    id: String,
    analytics: {
        name: String,
        description: String,
        memberCount: Number,
    },
    settings: {
        channel: String,
        images: Boolean,
        mention: String,
    }
});

export default mongoose.model("Server", serverSchema);