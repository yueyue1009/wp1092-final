import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        name: String,
        password: String,
        money: Number,
        winCount: Number,
        betCount: Number,
        bets: [{type: mongoose.Types.ObjectId, ref: 'bet'}]
    }
);
export default mongoose.model('users', UserSchema, 'users');