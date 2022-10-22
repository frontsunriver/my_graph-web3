import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { CustomRoute } from "./routes/types";

import { useActiveWeb3React } from "./hooks/";
import Web3ReactManager from "./web3/web3Manager";
import Layout from "./containers/Layout"

const AppWrapper = () => {

  useActiveWeb3React();

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

const App: React.FC = () => {
  return (
    <Router>
        <Web3ReactManager>
          <Switch>
            <CustomRoute path="/" component={Layout} />
          </Switch>
        </Web3ReactManager>
    </Router>
  );
};

export default AppWrapper;
