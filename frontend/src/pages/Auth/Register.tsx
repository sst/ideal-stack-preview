import { useAuth } from "@app/auth";
import { useNavigate } from "react-router-dom";

export function Register() {
  const auth = useAuth();
  const nav = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    await auth.register(
      fd.get("email") as string,
      fd.get("password") as string
    );
    nav("/auth/login");
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
