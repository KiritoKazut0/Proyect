import { Schema } from "mongoose";

const ReactiosnSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    typeReaction: {
        type: String,
        enum: ['love'],
        required: true

    }

})

export default ReactiosnSchema