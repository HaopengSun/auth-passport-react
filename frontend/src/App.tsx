import "./App.css";
import styled from "styled-components";
import { Link, Route, Switch } from "react-router-dom";
import { LoginSuccess } from "./app/containers/LoginSuccess";
import { useSelector } from "react-redux";
import LoginWithGoogle from "./app/pages/LoginWithGoogle";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 31px;
`;

function App() {
  const user = useSelector((state: any) => state.app.authUser as any) as any;

  return (
    <AppContainer>
      <Switch>
        <Route exact path="/">
          Welcome Home!
          <Link to="/login">Login</Link>
        </Route>
        <Route exact path="/login">
          <LoginWithGoogle />
        </Route>
        <Route path="/welcome">Welcome Back {user && user.fullName}</Route>
        <Route exact path="/login/success" component={LoginSuccess} />
        <Route path="/login/error">
          Error loging in. Please try again later!
        </Route>
      </Switch>
    </AppContainer>
  );
}

export default App;
