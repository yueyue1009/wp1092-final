import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import TabContentList from '../components/TabContentList';
import { shortDate } from '../components/utils';
import BetContent from '../components/BetContent';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

function range(start, end) {
  return Array(end - start + 1).fill().map((_, idx) => start + idx)
}

const initDateDelta = range(-190, 5)
const today = new Date();

export default function ScrollableTabsButtonAuto({user, setUser, isLogin}) {
  const classes = useStyles();
  const [value, setValue] = useState(shortDate(today));
  const [dateList, setDateList] = useState(initDateDelta.map((d) => today.addDays(d)));
  const [game, setGame] = useState({});

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setValue(newValue);
    setGame({});
  };

  return (
    <Paper elevation={2} style={{ height: "65vh" }}>
      <br></br>
      <Grid container>
        <Grid item xs={6} align="center">
          <AppBar position="static" color="default"
            style={{ width: "90%" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
            >
              {dateList.map((date, i) =>
                <Tab key={i} label={shortDate(date)}
                  value={shortDate(date)} {...a11yProps(shortDate(date))}  />
              )}
            </Tabs>
          </AppBar>
          <TabContentList value={value} dateList={dateList} setGame={setGame}/>
        </Grid>
        {!(Object.keys(game).length === 0 && game.constructor === Object)? (
          <BetContent game={game} setGame={setGame} user={user} setUser={setUser} isLogin={isLogin}></BetContent>
        ): (
          <>
          </>
        )}
      </Grid>
    </Paper>
  );
}

