import { Cognito } from "@serverless-stack/web";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function Confirm() {
  const cognito = Cognito.use();
  const nav = useNavigate();
  const [params] = useSearchParams();
  const email = params.get("email")!;
  const [error, errorSet] = useState<string>("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    cognito
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
      <button onClick={() => cognito.resend(email)}>Resend code</button>
    </div>
  );
}
