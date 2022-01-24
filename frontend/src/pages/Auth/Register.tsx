import { useCognito } from "@serverless-stack/web";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const auth = useCognito();
  const nav = useNavigate();
  const [error, errorSet] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = fd.get("email") as string;
    await auth
      .register(email, fd.get("password") as string)
      .then(() => nav("/auth/confirm?email=" + email))
      .catch((err) => errorSet(err.message));
  }
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email: <input type="text" name="email" />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" />
          </label>
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Register</button>
      </form>
      <Link to="/auth/login">Login</Link>
    </div>
  );
}
