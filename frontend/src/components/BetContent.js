import PropTypes from 'prop-types';
import { shortDate } from './utils';
import { getGameByDate } from '../api'
import { useEffect, useState, React} from 'react';
import { Paper, Button, Grid, Typography, Modal, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { newBet } from '../api';
import LOGOS from '../logos';
import CompetitionRecord from './CompetitionRecord';


const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'relative',
    width: 380,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    top: '50%',
    left: '50%'
  },
}));



function BetContent({ game, setGame, user, setUser, isLogin}){
  const classes = useStyles();
  const [betAmount, setBetAmount] = useState("");
  const [visitorModalOpen, setVisitorModalOpen] = useState(false);
  const [homeModalOpen, setHomeModalOpen] = useState(false);
  const [hintText, setHintText] = useState("");
  const [visitorOdds, setVisitorOdds] = useState(0);
  const [homeOdds, setHomeOdds] = useState(0);
  const handleChange = (func) => (event) => {
    func(event.target.value);
  };
  const handleVisitorClose = () => {
    setVisitorModalOpen(false);
  };
  const handleVisitorOpen = () => {
    setVisitorModalOpen(true);
  };
  const handleHomeClose = () => {
    setHomeModalOpen(false);
  };
  const handleHomeOpen = () => {
    setHomeModalOpen(true);
  };
  const updateOdds = () => {
    setVisitorOdds((1 + game.homebets / game.awaybets).toFixed(2));
    setHomeOdds((1 + game.awaybets / game.homebets).toFixed(2));
  }
  const handleBet = async (type) =>{
    if (betAmount === "") {
      setHintText("Enter an amount!")
      return;
    }
    if (Number(betAmount) > user.money) {
      setHintText(`Out of range. You only have $${user.money} left.`)
      return;
    }
    if (Number(betAmount) <= 0) {
      setHintText(`Your amount must be positive!`)
      return;
    }
    const { data } = await newBet(user.name, game.gameID, type, Number(betAmount));
    if (data.type === "success") {
      setHintText("Successfully placed a bet!");
      setBetAmount("");
      setUser({...user, money: data.money});
      let newGame = game;
      newGame.awaybets = data.awaybets;
      newGame.homebets = data.homebets;
      setGame(newGame);
      updateOdds();
    }
    else if (data.type === "error") {
      setHintText(data.message);
    }
  }
  useEffect(()=>{
    updateOdds();
  },[game])
  return (
    <Grid item container xs={6} direction='column'>
      <Grid item container direction='row'>
        <Grid container xs={6} align="center" direction="column">
          <br></br>
          <Grid item>
            <Typography variant='h6'>AWAY</Typography>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: '22px' }}>{game.visitorTeam}</Typography>
          </Grid>
          <Grid item>
            <img src={LOGOS[game.visitorTeamAbbr]} style={{ width: "100px" }} />
          </Grid>
          {(game.gameStatus === "Todo")? 
            ((isLogin) ? (
              <>
                <br></br>
                <Typography variant="body1">Odds:{visitorOdds}</Typography>
                <Grid item>
                  <Button variant="outlined" onClick={handleVisitorOpen}>Place a bet!</Button>
                </Grid>
                <Modal open={visitorModalOpen} onClose={handleVisitorClose}>
                  <div className={classes.modal}>
                    <Typography variant="h6" style={{ fontSize: "120%", fontWeight: "bold" }}>Type in the amount you want to bet</Typography>
                    <Typography variant="body1">or click anywhere to cancel</Typography>
                    <TextField size="small" variant="outlined" value={betAmount} onChange={handleChange(setBetAmount)} type="number"/>
                    <Typography variant="body2">{hintText}</Typography>
                    <Button variant="outlined" onClick={() => handleBet("away")}>Bet!</Button>
                  </div>

                </Modal>

              </>
            ) : (
                <Grid item>
                  <br></br>
                  <Typography variant="body1">Odds:{visitorOdds}</Typography>
                  <Typography color="primary" variant="h6"> Login to bet!</Typography>
                </Grid>
            )) : (game.gameStatus === 'Final') ? (
              <Grid item>
                {(game.visitorTeamScore > game.homeTeamScore)?
                  <Typography variant="h4" style={{ color:"#4ef5ad"}}>W {game.visitorTeamScore}</Typography> :
                  <Typography variant="h4" style={{ color: "#9e0214" }}>L {game.visitorTeamScore}</Typography>
                }
                <Typography variant="body1">Odds:{visitorOdds}</Typography>
              </Grid>
            ):(
              <Grid item>
                  <Typography variant="h4">{game.visitorTeamScore}</Typography>
              </Grid>
            )}
        </Grid>
        <Grid container item xs={6} align="center" direction="column">
          <br></br>
          <Grid item>
            <Typography variant='h6'>HOME</Typography>
          </Grid>
          <Grid item>
            <Typography style={{ fontSize: '22px' }}>{game.homeTeam}</Typography>
          </Grid>
          <Grid item>
            <img src={LOGOS[game.homeTeamAbbr]} style={{ width: "100px" }} />
          </Grid>
          {(game.gameStatus === "Todo") ?
            ((isLogin) ? (
              <>
                <br></br>
                <Typography variant="body1">Odds:{homeOdds}</Typography>
                <Grid item>
                  <Button variant="outlined" onClick={handleHomeOpen}>Place a bet!</Button>
                </Grid>
                <Modal open={homeModalOpen} onClose={handleHomeClose}>
                  <div className={classes.modal}>
                    <Typography variant="h6" style={{ fontSize: "120%", fontWeight: "bold" }}>Type in the amount you want to bet</Typography>
                    <Typography variant="body1">or click anywhere to cancel</Typography>
                    <TextField size="small" variant="outlined" value={betAmount} onChange={handleChange(setBetAmount)} type="number"/>
                    <Typography variant="body2">{hintText}</Typography>
                    <Button variant="outlined" onClick={() => handleBet("home")}>Bet!</Button>
                  </div>
                </Modal>
              </>
            ) : (
                <Grid item>
                  <br></br>
                  <Typography variant="body1">Odds:{homeOdds}</Typography>
                  <Typography color="primary" variant="h6"> Login to bet!</Typography>
                </Grid>
            )) : (game.gameStatus === 'Final')? (
              <Grid item>
                {(game.visitorTeamScore < game.homeTeamScore) ?
                  <Typography variant="h4" style={{ color: "#4ef5ad" }}>W {game.homeTeamScore}</Typography> :
                  <Typography variant="h4" style={{ color: "#9e0214" }}>L {game.homeTeamScore}</Typography>
                }
                <Typography variant="body1">Odds:{homeOdds}</Typography>
              </Grid>
            ) : (
              <Grid item>
                <Typography variant="h4">{game.homeTeamScore}</Typography>
              </Grid>
            )}
        </Grid>
      </Grid>
      {(game.gameStatus !== 'Final') ? (
        <Grid item>
          <CompetitionRecord home={game.homeTeamAbbr} visitor={game.visitorTeamAbbr} />
        </Grid>
      ) : (
        <></>
      )
      }
    </Grid>
  )
}
export default BetContent;
