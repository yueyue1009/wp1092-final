import { Router } from 'express';
import User from '../../models/User.js';
import * as url from "url";
// var url = require('url');
const router = Router();

router.get('/bets', async function (req, res) {
    try {
        let name = req.query.name
        let user = await User.findOne({name: name}).populate({
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

        for(const bet of user.bets) {
            if(bet.win !== "unknown" || bet.game.gameStatus !== 'Final'){
                continue;
            }
            if (bet.game.homeTeamScore > bet.game.visitorTeamScore) {
                if(bet.type == "home") {
                    bet.win = "true"
                    user.winCount += 1
                    user.betCount += 1
                }
                else {
                    bet.win = "false"
                    user.betCount += 1
                }
            }
            else {
                if(bet.type == "away") {
                    bet.win = "true"
                    user.winCount += 1
                    user.betCount += 1
                }
                else {
                    bet.win = "false"
                    user.betCount += 1
                }
            }
            bet.save()
        }
        user.save()
        res.status(200).send({
            type: 'success',
            winCount: user.winCount,
            betCount: user.betCount,
            bets: user.bets
        })
    } catch (e) {
        res.json({ message: 'mongo.find wrong' });
    }
})

router.post('/login', async function (req, res) {
    console.log(req.body)
    try {
        let user = await User.findOne(req.body)
        if(!user) {
            res.status(200).send({
                type: 'error',
                message: 'Wrong username or password!'
            })
        }
        else {
            res.status(200).send({
                type: 'success',
                message: 'Login success!',
                user: user
            })
        }
    } catch (e) {
        res.json({ message: 'mongo.find wrong' });
    }
});

router.post('/signup', async function (req, res) {
    try {
        console.log({name: req.body.name})
        const user = await User.find({name: req.body.name})
        console.log(user)
        if(user.length != 0) {
            res.status(200).send({
                type: 'error',
                message: 'This user name has been signed up!'
            })
        }
        else {
            const newUser = new User({
                name: req.body.name,
                password: req.body.password,
                money: 10000,
                winCount: 0,
                betCount: 0,
                bets: []
            })
            console.log(newUser)
            newUser.save()
            res.status(200).send({
                type: 'success',
                message: 'Successfully signed up!'
            })
        }
    } catch (e) {
        console.log(e)
        res.json({ message: 'mongo.find wrong' });
    }
})

export default router;
