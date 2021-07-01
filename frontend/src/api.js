import axios from 'axios';
import {sha256} from 'crypto-js'

const instance = axios.create({
  // baseURL: `http://localhost:4000/api`,
  baseURL: '/api',
});

const login = async (user) => { //user = {name, password(明碼)}
    let res
    try {
      // user.password = sha256(user.password) //(明碼變暗碼)
      res = await instance.post('/user/login', user)
      // user.password = sha256(user.password)
      console.log(res)
      return res
    }
    catch(error) {
      if (!error.response) {
        return 'Server no response'
      } else {
        console.log(error);
      }
    }
}

const signUp = async (user) => { 
  let res
  try {
    // user.password = sha256(user.password) //(明碼變暗碼)
    res = await instance.post('/user/signup', user)
    console.log(res)
  }
  catch(error) {
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  console.log(res)
  return res;
} 

const getGameByDate = async (date) => { 
  // console.log(date)
  let res;
  try {
    res = await instance.get('/schedule/Games', { 
      params:{
        gameDateTime: date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate()
      }
    });
    // console.log(date);
    // console.log(res);
  }
  catch(error) {
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  return res;
} 

// type = 'away' | 'home'
const newBet = async (username, gameID, type, money) => {
  console.log(username)
  let res;
  try {
    res = await instance.post('/bet/newBet', {
      username: username,
      gameID: gameID,
      type: type,
      money: money,
    });
  }
  catch(error){
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  console.log(res);
  return res;
}

const getBetHistory = async(username) => {
  let res;
  try {
    res = await instance.get('/user/bets', { 
      params:{
        name: username
      }
    });
  }
  catch(error) {
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  return res;
};

const  drawBet = async(id, gameID) => {
  let res;
  try {
    res = await instance.post('/bet/drawBet', { 
      id: id,
      gameID: gameID,
    });
  }
  catch(error) {
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  return res;
}

const getGameById = async(home, visitor) => {
  let res;
  try {
    res = await instance.get('/schedule/gamesById', { 
      params:{
        homeTeamAbbr: home,
        visitorTeamAbbr: visitor,
      }
    });
  }
  catch(error) {
    if (!error.response) {
      return 'Server no response'
    } else {
      console.log(error);
    }
  }
  return res;
};

export { login, signUp, getGameByDate, newBet, getBetHistory, drawBet, getGameById };
