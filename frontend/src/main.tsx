import React from "react";
import ReactDOM from "react-dom";

import * as urql from "urql";
import { Config } from "./config";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider, NeedsAuth } from "./auth";
import { Auth } from "./pages/Auth";
import { Todos } from "./pages/Todos";

const client = urql.createClient({
  url: Config.APOLLO_URL,
  fetchOptions: () => {
    const token = localStorage.getItem("token");
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <urql.Provider value={client}>
        <App />
      </urql.Provider>
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<Auth />} />
        <Route path="*" element={<Authenticated />} />
      </Routes>
    </BrowserRouter>
  );
}

function Authenticated() {
  return (
    <NeedsAuth redirectTo="/auth/login">
      <Routes>
        <Route path="/todos" element={<Todos />} />
      </Routes>
    </NeedsAuth>
  );
}
