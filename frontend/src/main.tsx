import React from "react";
import ReactDOM from "react-dom";

import * as urql from "urql";
import { Config } from "./config";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Cognito, CognitoProvider, useCognito } from "./auth";
import { Auth } from "./pages/Auth";
import { Todos } from "./pages/Todos";

const cognito = new Cognito({
  UserPoolId: Config.COGNITO_USER_POOL_ID,
  ClientId: Config.COGNITO_CLIENT_ID,
});

const client = urql.createClient({
  url: Config.APOLLO_URL,
  fetchOptions: () => {
    const token = cognito.session?.getAccessToken().getJwtToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" },
    };
  },
});

ReactDOM.render(
  <React.StrictMode>
    <urql.Provider value={client}>
      <CognitoProvider value={cognito}>
        <App />
      </CognitoProvider>
    </urql.Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

function App() {
  console.log("Rendering app");
  const auth = useCognito();
  if (auth.isInitializing) return <span>Checking auth...</span>;

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
  const auth = useCognito();
  if (!auth.session) return <Navigate to="/auth/login" />;
  return (
    <Routes>
      <Route path="/todos" element={<Todos />} />
    </Routes>
  );
}
