import { Grid, Paper, Typography, Button } from '@material-ui/core';
import { getGameByDate, newBet } from '../api'
import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LOGOS from '../logos'

const useStyles = makeStyles((theme) => ({
  logoImg: {
    height: "100px",
  },
  score: {
    fontSize: 'xx-large',
  },
  status: {
    fontSize: 'large',
  }
}));

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

function formattedTime(dateStr){
  const date = new Date(Date.parse(dateStr));
  const am_pm = date.getUTCHours() >= 12 ? 'PM' : 'AM';
  return `${date.getUTCHours().pad(2)}:${date.getUTCMinutes().pad(2)} ${am_pm}`;
}

function TabContent({ date, setGame }){
  const classes = useStyles();
  const [games, setGames] = useState([]);
  const [text, setText] = useState("");

  const handleClick = (game)=>{
    setGame(game);
  }

  useEffect(async () => {
    setText("");
    const { data } = await getGameByDate(date);
    if (data.type === "success") {
      console.log(data.today);
      setGames(data.today);
      if (data.today.length === 0){
        setText("There are no game playing this day!");
      }
    }
    else if (data.type === "error"){
      setGames({});
      setText(data.message);
    }
  }, [])
  return (
    games.length === 0 ? (
      <>
        <Typography style={{ fontSize: '20px'}}>{text}</Typography>
      </>
    ):(
      <>
        {games.map((game, idx) => (
          <Grid item key={idx} style={{width: "80%", marginBottom: "3%"}}>
            <Paper elevation={3}>
              <Button style={{ width: "100%"}} onClick={() => handleClick(game)}>
                <Grid container direction='row' justify='space-around' alignItems='center'>
                  <Grid item>
                    <Grid container direction='column' alignItems='center'>
                      <Grid item>
                        <Typography variant='h6'>AWAY</Typography>
                        <img src={LOGOS[game.visitorTeamAbbr]} className={classes.logoImg}/>
                      </Grid>
                      <Grid item>
                        <Typography variant='body1' style={{fontSize:"120%"}}>{game.visitorTeamAbbr}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item>
                    <p className={classes.score}>{game.visitorTeamScore}</p>
                  </Grid>
                  <Grid item>
                    {(game.gameStatus === 'Final') ? (
                      <p className={classes.status}>{game.gameStatus}</p>
                    ): (game.gameStatus === 'InProgress') ? (
                      <p className={classes.status}>In Progress</p>
                    ): (
                      <p className={classes.status}>{formattedTime(game.gameDateTime)}</p>
                    )}
                  </Grid>
                  <Grid item>
                    <p className={classes.score}>{game.homeTeamScore}</p>
                  </Grid>
                  <Grid item>
                    <Grid container direction='column' alignItems='center'>
                      <Grid item>
                        <Typography variant='h6'>HOME</Typography>
                        <img src={LOGOS[game.homeTeamAbbr]} className={classes.logoImg}/>
                      </Grid>
                      <Grid item>
                        <Typography variant='body1' style={{ fontSize: "120%" }}>{game.homeTeamAbbr}</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Button>
            </Paper>
          </Grid>
        ))}
      </>
    )
  )
}

export default TabContent;
