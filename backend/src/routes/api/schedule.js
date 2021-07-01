import { Router } from 'express';
import Schedule from '../../models/Schedule.js';
import * as url from "url";
// import CompetitionBet from '../../models/CompetitionBet'
// var url = require('url');
const router = Router();

const daySeconds = 86400000
const range = 3
//req.query.gameDateTime = new Date("2021-06-16")
router.get('/Games', async function (req, res) {
    try {
        let q = url.parse(req.url, true);
        let todayStart = new Date(q.query.gameDateTime);
        let todayEnd = new Date(q.query.gameDateTime);
        todayStart.setHours(todayStart.getHours() + 8)
        todayEnd.setHours(todayStart.getHours() + 24)
        console.log(todayStart)
        console.log(todayEnd)
        let games = await Schedule.find(
        {"gameDateTime":{
            $gte: todayStart,
            $lt: todayEnd}
        })
        // let games = await Schedule.find({"gameDateTime": gameDateTime})
        const today = []
        for(const game of games) {
            if(!game.homebets) {
                game.homebets = 100000
                game.awaybets = 100000
                await game.save()
            }
            today.push(game.toObject())
            // if(game.gameDateTime < gameDateTime) { 
            //   before.push(game)
            // }
            // else if (game.gameDateTime > gameDateTime)
            //   after.push(game)
            // else 
        }
        
        res.status(200).send({
            type: 'success',
            // before: before,
            today: today,
            // after: after
        })
    } catch (e) {
        console.log(e)
        res.status(200).json({
            type: "error",
            message: 'Server went wrong...' 
        });
    }
});

router.get('/gamesById', async function (req, res) {
    try {
        let q = url.parse(req.url, true);
        const {homeTeamAbbr, visitorTeamAbbr} = q.query
        console.log(homeTeamAbbr, visitorTeamAbbr)
        let games = await Schedule.find({
            "homeTeamAbbr": [homeTeamAbbr, visitorTeamAbbr],
            "visitorTeamAbbr": [homeTeamAbbr, visitorTeamAbbr],
            "gameStatus": "Final",
        }).sort({"gameDateTime": -1}).limit(5)
        res.status(200).send({
            type: 'success',
            games
        })
    } catch(e) {
        console.log(e)
        res.status(200).json({
            type: "error",
            message: 'Server went wrong...' 
        });
    }
})


export default router;
