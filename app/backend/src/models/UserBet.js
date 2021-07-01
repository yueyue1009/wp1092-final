import mongoose  from "mongoose";

const UserBetSchema = new mongoose.Schema (
    {
        userId: {type: mongoose.Types.ObjectId, ref: 'users'},
        bets: [{type: mongoose.Types.ObjectId, ref: 'Bet'}]
    }
)

export default mongoose.model('userBet', UserBetSchema, 'userBet');