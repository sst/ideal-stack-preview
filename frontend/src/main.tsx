import React from "react";
import ReactDOM from "react-dom";

import { Todos } from "./pages/Todos";
import * as urql from "urql";
import { Config } from "./config";

const client = urql.createClient({
  url: Config.APOLLO_URL,
});

ReactDOM.render(
  <React.StrictMode>
    <urql.Provider value={client}>
      <App />
    </urql.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  return <Todos />;
}
