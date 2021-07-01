import { useEffect, useState } from 'react';
import  {
  Grid,
  List,
  ListItem,
  Typography,
  Divider,
  makeStyles,
} from '@material-ui/core';
import { getGameById } from '../api';

const useStyles = makeStyles((theme) => ({
  text: {
    textAlign: "center",
  },
}));

function formattedDate(dateStr){
  const date = new Date(Date.parse(dateStr));
  return `${(date.getUTCMonth()+1).pad(2)}/${date.getUTCDate().pad(2)}`;
}

function CompetitionRecord({ home, visitor }){
  const classes = useStyles();

  const [games, setGames] = useState([]);

  useEffect(async () => {
    let res = await getGameById(home, visitor);
    if (res.data.type === "success") {
      console.log(res.data.games);
      setGames(res.data.games);
    }
  }, [])

  return (
    <List>
      <Divider variant='inset'/>
      {games.map((game, i) => {
        const homeScore = (game.homeTeamAbbr === home) ? game.homeTeamScore : game.visitorTeamScore;
        const visitorScore = (game.visitorTeamAbbr === visitor) ? game.visitorTeamScore : game.homeTeamScore;
        return (
          <>
            <ListItem key={i}>
              <Grid item xs={6}>
                <Typography className={classes.text} style={(visitorScore > homeScore) ? {fontWeight:"bolder"}:{}}>{visitorScore}</Typography>
              </Grid>
              <Grid item xs={1}>
                <Typography className={classes.text}>{formattedDate(game.gameDateTime)}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography className={classes.text} style={(homeScore > visitorScore) ? {fontWeight:"bolder"}:{}}>{homeScore}</Typography>
              </Grid>
            </ListItem>
            <Divider variant='inset'/>
          </>
        )
      })}
    </List>
  );
}

export default CompetitionRecord;