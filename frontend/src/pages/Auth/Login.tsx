import { useAuth } from "@app/auth";

export function Login() {
  const auth = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    await auth.login(fd.get("email") as string, fd.get("password") as string);
  }

  return (
    <div>
      <h2>Login</h2>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
