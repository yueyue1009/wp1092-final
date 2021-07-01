import { Router } from 'express';
// import CompetitionBet from '../../models/CompetitionBet';
import Bet from '../../models/Bet.js'
import User from '../../models/User.js';
import Schedule from '../../models/Schedule.js';
const router = Router();
let count = -1

router.post('/newBet', async function (req, res) {
    try {
        if(count == -1) {
            count = await Bet.countDocuments();
        }
        const { username, gameID, type, money } = req.body
        if(type != "away" && type != "home") {
            res.status(200).json({
                type: "error",
                message: 'type should be "home" or "away"!' 
            });
            return 
        }
        if(money <= 0) {
            res.status(200).json({
                type: "error",
                message: 'money can\'t less or equal to zero!' 
            });
            return 
        }
        const user = await User.findOne({name: username}).populate({
            path: 'bets',
            model: 'bet',
            populate: [{
                path: 'game',
                model: 'schedule'
            }]
        })
        if(!user) {
            res.status(200).json({
                type: "error",
                message: 'user not found' 
            });
            return 
        }
        let game = await Schedule.findOne({gameID:gameID})
        if(!game) {
            res.status(200).json({
                type: "error",
                message: 'game not found' 
            });
            return 
        }
        const newBet = new Bet({
            id: count + 1,
            user: user, 
            game: game,
            win: "unknown", //有沒有贏 "true", "false", "unknown"
            draw: false, //有沒有領取了
            type: type, // "home" or "away"
            money: money,
            createdAt: new Date(),
        })
        count += 1
        if(user.money < money) {
            res.status(200).send({
                type: 'error',
                message: 'money is not enough to pay'
            })
            return 
        }
        await newBet.save()
        user.money -= money
        user.bets.push(newBet)
        // user.betCount += 1
        await user.save()
        if(type == "home") {
            game.homebets += money
        }
        else {
            game.awaybets += money
        }
        await game.save()
        res.status(200).send({
            type: 'success',
            money: user.money,
            homebets: game.homebets,
            awaybets: game.awaybets
        })
    } catch (e) {
        console.log(e)
        res.status(200).json({
            type: "error",
            message: 'Bet has problem' 
        });
    }
});

router.post('/drawBet', async function (req, res) {
    try {
        const {id, gameID} = req.body
        let bet = await Bet.findOne({id: id}).populate("user")
        if(!bet) {
            res.status(200).json({
                type: "error",
                message: `betId: ${id} not found` 
            });
            return
        } 
        else if (bet.win != "true" || bet.draw == true) {
            res.status(200).json({
                type: "error",
                message: `betId: ${id} does not win or has been drawn` 
            });
            return
        }
        let game = await Schedule.findOne({gameID: gameID})
        bet.draw = true
        if(bet.type == "home") {
            bet.user.money += bet.money * game.awaybets / game.homebets
        }
        else {
            bet.user.money += bet.money * game.homebets / game.awaybets
        }
        bet.user.money = Math.floor(bet.user.money)
        await bet.save()
        await bet.user.save()
        res.status(200).json({
            type: "success",
            message: 'Drawn success',
            money: bet.user.money 
        });
    } catch(e) {
        console.log(e)
        res.status(200).json({
            type: "error",
            message: 'drawBet has problem' 
        });
    }
})


export default router;
