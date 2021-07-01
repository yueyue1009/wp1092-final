import mongoose  from "mongoose";

const BetSchema = new mongoose.Schema (
    {
        id: Number,
        user: {type: mongoose.Types.ObjectId, ref: 'users'},
        game: {type: mongoose.Types.ObjectId, ref: 'schedule'},
        win: String,
        draw: Boolean,
        type: String,
        money: Number,
        createdAt: Date,
    }
)

export default mongoose.model('bet', BetSchema, 'bet');