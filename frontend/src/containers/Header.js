import {useState, React, useEffect} from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Typography, Grid, TextField, Button, Modal } from '@material-ui/core';
import nba_image from "./nba_logo.png"
import fire from "./fire.png"
import ice from "./ice.png"
import bronze from "./bronze.png"
import silver from "./silver.png"
import gold from "./gold.png"
import diamond from "./diamond.png"
import {login, signUp} from '../api'
import ReactCardFlip from 'react-card-flip';
import BetHistory from '../components/BetHistory';

const useStyles = makeStyles((theme) => ({
    root: {
        // position: 'relative',
        backgroundColor: "black",
        marginBottom: theme.spacing(1),
        elevation: 2,
        flexGrow: 1,
        padding: "10px",
        height: "25vh"
    },
    typography: {
        fontFamily: "fantasy",
    },
    userInfo: {
        color: "#ffffff",
    },
    logIn: {
        backgroundColor: "#d9e7ff",
        padding: "10px",
        height: "20vh"
    },
    signUp: {
        backgroundColor: "#ffe8ec",
        padding: "10px",
        height: "auto"
    },
    textField: {
        marginLeft: theme.spacing(0.5),
        marginRight: theme.spacing(0.5),
        width: "2in",
        color: "white",
    },
    button: {
        marginTop: theme.spacing(1)
    },
}));

export default function Header({user , setUser, isLogin, setIsLogin}) {
    const classes = useStyles();
    const [userName, setUserName] = useState("");
    const [password, setPassWord] = useState("");
    const [hintText, setHintText] = useState("");
    const [openBetHistory, setOpenBetHistory] = useState(false);
    const [flippedToSign, setFlippedToSign] = useState(false);
    console.log(isLogin);
    const handleChange = (func) => (event) => {
        func(event.target.value);
    };

    const handleLogin = async ()=>{
        if (userName === "" && password === "") {
            setHintText("Missing username and password!")
            return;
        }
        if (userName === ""){
            setHintText("Missing username!")
            return;
        }
        if (password === ""){
            setHintText("Missing password!")
            return;
        }
        const {data} = await login({ name: userName, password: password });
        if (data.type === "success"){
            console.log(data)
            console.log(data.user)
            setUser(data.user);
            setIsLogin(true);
            setUserName("")
            setPassWord("")
        }
        else if (data.type === "error"){
            setHintText(data.message);
        }
    }

    const handleSignUp = async () => {
        if (userName === "" && password === "") {
            setHintText("Missing username and password!")
            return;
        }
        if (userName === "") {
            setHintText("Missing username!")
            return;
        }
        if (password === "") {
            setHintText("Missing password!")
            return;
        }
        const {data} = await signUp({ name: userName, password: password });
        if (data.type === "success") {
            setHintText(data.message);
            setFlippedToSign(false)
            setUserName("")
            setPassWord("")
        }
        else if (data.type === "error") {
            setHintText(data.message);
        }
    }

    const handleSwitch = () =>{
        if (flippedToSign === true) setFlippedToSign(false);
        else setFlippedToSign(true)
        setHintText("");
        setUserName("");
        setPassWord("");
    }
        
    const handleOpenBetHistory = () => {
        setOpenBetHistory(true);
    }

    const handleCloseBetHistory = () => {
        setOpenBetHistory(false);
    }

    const handleLogout = ()=>{
        setIsLogin(false);
        setHintText("");
        setUser({});
    }


    return (
        <Paper className={classes.root} >
            {/* Increase the priority of the hero background image */}
            {/* {<img style={{ display: 'none' }} src={post.image} alt={post.imageText} />} */}
            <Grid container justify="spacing-between" alignItems='center' style={{height: "100%"}}>
                <Grid item container xs={4} alignItems='center' >
                    <Grid item xs={2} style={{height:"100%"}}>
                        <img src={nba_image} alt="nba logo" style={{ height: "80%", width: "80%" }} />
                    </Grid>
                    <Grid container item xs={2} direction="column" spacing={1}  >
                        <Grid item>
                            <Typography  textAlign="left" className={classes.typography} component="h1" variant="h2">
                                <span style={{ color: "#17408b" }}>N</span>
                                <span style={{ color: "#ffffff" }}>B</span>
                                <span style={{ color: "#c9082a" }}>A</span>
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Typography textAlign="left" className={classes.typography} style={{ color: "#ffffff" }} component="h1" variant="h2">
                                Lottery
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
                
                <Grid item xs={3}></Grid>                
                <Grid item xs={4} align="center">
                    {isLogin? 
                        (<Grid container direction='column' alignItems='center' justify='space-evenly'>
                            <Grid item>
                                <Typography className={classes.typography, classes.userInfo} variant="h5">
                                    Welcome back, {user.name}!
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography className={classes.typography, classes.userInfo} variant="h5">
                                    You have {user.money} in your wallet.
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Grid container direction='row' justify='space-between' alignItems='center'>
                                    <Grid item>
                                        <Button variant="outlined" color="secondary" onClick={handleLogout}>Logout</Button>
                                    </Grid>
                                    <Grid item>
                                        <Button variant="outlined" color="secondary" onClick={handleOpenBetHistory}>Betting History</Button>
                                        <Modal
                                            open={openBetHistory}
                                            onClose={handleCloseBetHistory}
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                        >
                                            <BetHistory user={user} setUser={setUser}/>
                                        </Modal>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>) :
                        (<ReactCardFlip isFlipped={flippedToSign} flipDirection="vertical">
                            <Paper elevation={3} className={classes.logIn}>
                                <TextField size="small" label="UserName" className={classes.textField}
                                    variant="outlined" value={userName} onChange={handleChange(setUserName)} />
                                <TextField size="small" label="Password" type="password" className={classes.textField}
                                    variant="outlined" value={password} onChange={handleChange(setPassWord)} />
                                <Grid item xs={2}>
                                    <Button color="primary" variant="contained" className={classes.button} onClick={handleLogin}>Login</Button>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">{hintText}</Typography>
                                </Grid>
                                <Grid item xs>
                                    <Button onClick={handleSwitch}><u>Haven't signup? Click to signup!</u></Button>
                                </Grid>
                            </Paper>
                            <Paper elevation={3} className={classes.signUp}>
                                <TextField size="small" label="UserName" className={classes.textField}
                                    variant="outlined" value={userName} onChange={handleChange(setUserName)} />
                                <TextField size="small" label="Password" type="password"  className={classes.textField}
                                    variant="outlined" value={password} onChange={handleChange(setPassWord)} />
                                <Grid item xs={2}>
                                    <Button color="primary" variant="contained" className={classes.button} onClick={handleSignUp}>SignUp</Button>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body2">{hintText}</Typography>
                                </Grid>
                                <Grid item xs>
                                    <Button onClick={handleSwitch}><u>Already have an account? Click to login!</u></Button>
                                </Grid>
                            </Paper>
                        </ReactCardFlip>)}
                </Grid>
                <Grid item container xs={1} direction="column">
                    <Grid item>
                        {(isLogin && user.betCount >= 10)? (
                            ((user.winCount / user.betCount >= 0.7)? (
                                <img src={fire} width="50%" height="50%" />
                            ): ((user.winCount / user.betCount <= 0.3)? (
                                <img src={ice} width="50%" height="50%" />
                            ):(<></>)))):(<></>)}
                    </Grid>
                    <Grid item>
                        {(user.betCount >= 100)? (
                            <img src={diamond} width="50%" height="50%" />
                        ):((user.betCount >= 80)? (
                            <img src={gold} width="50%" height="50%" />
                        ):((user.betCount >= 50)?(
                            <img src={silver} width="50%" height="50%" />
                        ):(user.betCount >= 10)?(
                            <img src={bronze} width="50%" height="50%" />
                        ):(<></>)))}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

Header.propTypes = {
    post: PropTypes.object,
};
