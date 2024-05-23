import { Schema, model } from "mongoose";
import CommentSchema from "./Coment";
import ReactionsSchema from "./Reactions";

const PublicationSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    image: {
        type: String,
        required: true
    },
    comment: [CommentSchema],
    reactions: [ReactionsSchema]
}, {
    versionKey: false
});

PublicationSchema.index({
    "reactions.users": 1
}, {
    unique: true,
    partialFilterExpression: { "reactions.users": { $exists: true, $ne: null } }
});

export default model('Publication', PublicationSchema);
