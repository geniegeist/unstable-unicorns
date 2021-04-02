import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Client from './Client';

const App = () => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/test">
            <Client debug={"test"}/>
          </Route>
          <Route path="/:gameId/:numPlayers/:playerID">
              <Client />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
