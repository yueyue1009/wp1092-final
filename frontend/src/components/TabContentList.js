import PropTypes from 'prop-types';
import { shortDate } from './utils';
import TabContent from './TabContent';
import { useEffect, useState, React } from 'react';
import { Grid, Box, Typography, makeStyles } from '@material-ui/core';


function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  tabContent: {
    maxHeight: "500px",
    maxWidth: "95%",
    overflow: "auto",
  },
}));

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function TabContentList({ value, dateList, setGame }){
  const classes = useStyles();

  return (
    dateList.map((date, i) => 
      <TabPanel date={date} value={value} index={shortDate(date)} className={classes.tabContent} key={i} align="center">
        <Grid container direction="column" alignItems="center">
          <TabContent date={date} setGame={setGame}/>
        </Grid>
      </TabPanel>
    )
  )
}
export default TabContentList;
