import { Schema } from "mongoose";

const CommentSchema = new Schema ({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    content:{
        type: String,
        required: true,
    },
    
    date: {
        type: Date,
        default: Date.now,
        required: true
    }

},{
    _id: false
})

export default CommentSchema;