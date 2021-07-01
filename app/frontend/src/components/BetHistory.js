import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core';
import { Box, Divider, Paper, Button, List, ListItem, ListItemIcon, Grid, Typography } from '@material-ui/core';
import { getBetHistory, drawBet } from '../api';
import LOGOS from '../logos';

const useStyles = makeStyles((theme) => ({
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '200px',
    margin: 'auto',
    width: '700px',
    maxHeight: '500px',
    overflow: 'auto',
  },
  logoImg: {
    height: "75px",
  },
  score: {
    fontSize: 'xx-large',
  },
  status: {
    fontSize: 'large',
  }
}));

function formattedDate(dateStr){
  const date = new Date(Date.parse(dateStr));
  return `${(date.getUTCMonth()+1).pad(2)}/${date.getUTCDate().pad(2)}`;
}

function formattedTime(dateStr){
  const date = new Date(Date.parse(dateStr));
  const am_pm = date.getUTCHours() >= 12 ? 'PM' : 'AM';
  return `${date.getUTCHours().pad(2)}:${date.getUTCMinutes().pad(2)} ${am_pm}`;
}

function OneBet({ data, user, setUser, setBetHistory }){
  const classes = useStyles();
  const { game } = data;
  const odds = (game.homebets+game.awaybets) / ( data.type === 'home' ? game.homebets : game.awaybets);

  const handleDraw = async (data) => {
    console.log(`Draw: ${data.id} ${data.game.gameID}`);
    let res = await drawBet(data.id, data.game.gameID);
    if (res.data.type === "success") {
      setUser({...user, money: res.data.money, winCount: user.winCount+1, betCount: user.betCount+1});
    }

    // Get New Betting History
    res = await getBetHistory(user.name);
    if(res.data.type === 'success'){
      setBetHistory(res.data.bets);
    }
  }

  return(
    <ListItem>
      <Grid container direction='row' justify='space-around' alignItems='center'>
        <Grid item>
          <Typography variant='h6'>{formattedDate(game.gameDateTime)}</Typography>
        </Grid>
        <Grid item>
            <Grid container direction='column' alignItems='center'>
              <Grid item>
                <img src={LOGOS[game.homeTeamAbbr]} className={classes.logoImg}/>
              </Grid>
              <Grid item>
                <p>{game.homeTeamAbbr}</p>
              </Grid>
            </Grid>
        </Grid>
        <Grid item>
          <p className={classes.score}>{game.homeTeamScore}</p>
        </Grid>
        <Grid item>
          {game.gameStatus === 'Final' ? (
            <p className={classes.status}>{game.gameStatus}</p>
          )
          : (game.gameStatus === 'InProgress') ?  (
            <p className={classes.status}>In Progress</p>
          ) : (
            <p className={classes.status}>{formattedTime(game.gameDateTime)}</p>
          )}
        </Grid>
        <Grid item>
          <p className={classes.score}>{game.visitorTeamScore}</p>
        </Grid>
        <Grid item>
            <Grid container direction='column' alignItems='center'>
              <Grid item>
                <img src={LOGOS[game.visitorTeamAbbr]} className={classes.logoImg}/>
              </Grid>
              <Grid item>
                <p>{game.visitorTeamAbbr}</p>
              </Grid>
            </Grid>
        </Grid>
        <Grid item>
          <Typography> ODDS: {odds.toFixed(3)}</Typography>
          <Typography> BET: {data.money}</Typography>
          <Typography> GET: {(data.money*odds).toFixed(3)}</Typography>
        </Grid>
        <Grid item>
          {(data.win === 'true') ? 
            (data.draw) ? (
              <Button variant="outlined" disabled>Drew</Button>
            ):(
              <Button variant="outlined" onClick={() => handleDraw(data)}>Draw</Button>
            )
          :(data.win === 'false') ? (
            <Typography>Lose</Typography>
          ):(
            <Typography>Unknown</Typography>
          )}
        </Grid>
      </Grid>
    </ListItem>
  )
}

function BetHistory({ user, setUser }){
  const classes = useStyles();
  const [betHistory, setBetHistory] = useState([]);
  
  useEffect(async () => {
    let res = await getBetHistory(user.name);
    if(res.data.type === 'success'){
      setBetHistory(res.data.bets);
    }
    console.log(res);
  }, []);
  
  useEffect(() => {
    console.log(betHistory);
  }, [betHistory])

  return (
    <Paper className={classes.modal}>
      <List>
        {betHistory.map((data, i) => {
          return (
            <OneBet data={data} user={user} setUser={setUser} setBetHistory={setBetHistory}/>
          )
        })}
      </List>
    </Paper>
  );
}

export default BetHistory;
