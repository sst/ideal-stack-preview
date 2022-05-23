import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider as UrqlProvider, createClient, defaultExchanges } from "urql";
import { CognitoProvider, Cognito, useCognito } from "@serverless-stack/web";
import { Auth } from "./pages/Auth";
import { List } from "./pages/Article";

console.log(import.meta.env);
const cognito = new Cognito({
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID
});

const urql = createClient({
  url: import.meta.env.VITE_GRAPHQL_URL,
  exchanges: defaultExchanges,
  fetchOptions: () => {
    const token = cognito.session?.getAccessToken().getJwtToken();
    return {
      headers: { authorization: token ? `Bearer ${token}` : "" }
    };
  }
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CognitoProvider value={cognito}>
      <UrqlProvider value={urql}>
        <App />
      </UrqlProvider>
    </CognitoProvider>
  </React.StrictMode>
);

function App() {
  console.log("Rendering app");
  const cognito = useCognito();
  if (cognito.isInitializing) return <span>Checking auth...</span>;

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
      <Route path="/" element={<Navigate to="/articles" />} />
      <Route path="articles" element={<List />} />
    </Routes>
  );
}
