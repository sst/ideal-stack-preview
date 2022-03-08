import { Cognito } from "@serverless-stack/web";
import {
  useTodosQuery,
  useCreateTodoMutation,
  useRemoveTodoMutation,
  useUploadMutation,
} from "@app/data/urql";

export function Todos() {
  const cognito = Cognito.use();
  const [todos] = useTodosQuery();
  const [, create] = useCreateTodoMutation();
  const [, remove] = useRemoveTodoMutation();
  const [, upload] = useUploadMutation();

  if (!todos.data) return <div>Loading...</div>;

  function handleCreate() {
    const title = prompt("Enter a title for your todo");
    if (!title) return;
    create({
      id: Math.random().toString(),
      title: title,
    });
  }

  return (
    <div>
      <button onClick={handleCreate}>Add Todo</button>
      <input
        type="file"
        onChange={async (e) => {
          const [file] = e.target.files!;
          const url = await upload({
            type: file.type,
            name: file.name,
          });
          console.log(url);
          await fetch(url.data!.upload, {
            method: "PUT",
            body: file,
          });
          e.target.value = "";
        }}
      />
      <div>
        {todos.data.session.currentUser.todos.map((todo) => (
          <div
            key={todo.id}
            onClick={() =>
              remove({
                id: todo.id,
              })
            }
          >
            <div>{todo.title}</div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          cognito.state.user?.signOut();
          location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
}
