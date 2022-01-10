import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";

export function Auth() {
  return (
    <div>
      <h1>Auth</h1>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
    </div>
  );
}
