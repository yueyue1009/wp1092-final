import Header from './Header';
import Body from './Body';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper';
import { Container } from '@material-ui/core';
import { useState } from 'react';
import Marquee from "react-fast-marquee";
import LOGOS from '../logos'


const Wrapper = styled.div`
  width: 1;
  height: 200vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const StyledPaper = styled(Paper)`
  padding: 2em;
`;

function App() {

  const [user, setUser] = useState({});
  const [isLogin, setIsLogin] = useState(false);
  return (
    <Container maxWidth="false" style={{
      backgroundColor: "#d7f4fc", width: "auto", height:"auto"}}>
      <Header user={user} setUser={setUser} isLogin={isLogin} setIsLogin={setIsLogin} />
      <Body user={user} setUser={setUser} isLogin={isLogin} />
      <p></p>
      <Marquee gradientWidth="30px" gradientColor={[215, 244, 252]}>
        {Object.keys(LOGOS).map((logo, idx) => (
          <img src={LOGOS[logo]} style={{height: "10vh"}}/>
        ))}
      </Marquee>
    </Container>
  );
}

export default App;
