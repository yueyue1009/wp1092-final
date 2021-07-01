import mongoose from 'mongoose'

const scheduleSchema = new mongoose.Schema(
    {
        gameDateTime: Date,
        gameStatus: String,
        gameID: String,
        seasonType: String,
        homeTeam: String,
        homeTeamAbbr: String,
        visitorTeam: String,
        visitorTeamAbbr: String,
        homeTeamScore: Number,
        visitorTeamScore: Number,
        homebets: Number,
        awaybets: Number
    }
);
export default mongoose.model('schedule', scheduleSchema, 'schedule');