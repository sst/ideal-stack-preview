import { useCognito } from "@app/auth";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

export function Login() {
  const auth = useCognito();
  const nav = useNavigate();
  const [error, errorSet] = useState<string>("");
  const [params] = useSearchParams();
  const email = params.get("email")!;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = fd.get("email") as string;
    await auth
      .login(email, fd.get("password") as string)
      .then(() => nav("/todos"))
      .catch((err) => {
        if (err.name === "UserNotConfirmedException") {
          nav("/auth/confirm?email=" + email);
          return;
        }
        errorSet(err.message);
      });
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Email: <input defaultValue={email} type="text" name="email" />
          </label>
        </div>
        <div>
          <label>
            Password: <input type="password" name="password" />
          </label>
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Login</button>
      </form>
      <Link to="/auth/register">Register</Link>
    </div>
  );
}
