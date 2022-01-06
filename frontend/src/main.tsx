import React from "react";
import ReactDOM from "react-dom";

import { Todos } from "./pages/Todos";
import * as urql from "urql";

const client = urql.createClient({
  url: "https://d7nn8pnx3g.execute-api.us-east-2.amazonaws.com",
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
