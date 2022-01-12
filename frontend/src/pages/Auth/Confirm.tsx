import { useCognito } from "@app/auth";
import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

export function Confirm() {
  const auth = useCognito();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email")!;
  const [error, errorSet] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    auth
      .confirm(email, fd.get("code") as string)
      .then(() => nav("/auth/login?email=" + email))
      .catch((err) => errorSet(err.message));
  }

  return (
    <div>
      <h2>Confirm</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Code: <input type="text" name="code" />
          </label>
        </div>
        {error && <div>{error}</div>}
        <button type="submit">Confirm</button>
      </form>
      <button onClick={() => auth.resend(email)}>Resend code</button>
    </div>
  );
}
