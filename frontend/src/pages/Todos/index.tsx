import { useTodosQuery } from "@app/data/urql";

export function Todos() {
  const [todos] = useTodosQuery();

  if (!todos.data) return <div>Loading...</div>;

  return (
    <div>
      {todos.data.session.currentUser.todos.map((todo) => (
        <div key={todo.id}>
          <div>{todo.title}</div>
        </div>
      ))}
    </div>
  );
}
