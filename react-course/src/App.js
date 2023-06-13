import { Route, Switch } from "react-router-dom";
import { AllMeetups, NewMeetup, Favorites } from "./pages";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <AllMeetups />
      </Route>
      <Route path="/new-meetup">
        <NewMeetup />
      </Route>
      <Route path="/favorite">
        <Favorites />
      </Route>
    </Switch>
  );
};

export default App;
