import mongoose  from "mongoose";

const CompetitionBetSchema = new mongoose.Schema (
    {
        gameID: String,
        game: {type: mongoose.Types.ObjectId, ref: 'schedule'},
        homebets: Number,
        awaybets: Number, 
    }
)

export default mongoose.model('competitionBet', CompetitionBetSchema, 'competitionBet');