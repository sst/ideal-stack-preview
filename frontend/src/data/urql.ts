import gql from "graphql-tag";
import * as Urql from "urql";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateTodoInput = {
  id: Scalars["String"];
  title: Scalars["String"];
};

export type Debug = {
  __typename?: "Debug";
  database: Scalars["String"];
};

export type Mutation = {
  __typename?: "Mutation";
  createTodo: Todo;
  removeTodo?: Maybe<Todo>;
};

export type MutationCreateTodoArgs = {
  input: CreateTodoInput;
};

export type MutationRemoveTodoArgs = {
  id: Scalars["String"];
};

export type Query = {
  __typename?: "Query";
  debug: Debug;
  session: Session;
  user: User;
};

export type QueryUserArgs = {
  id: Scalars["ID"];
};

export type Session = {
  __typename?: "Session";
  currentUser: User;
};

export type Todo = {
  __typename?: "Todo";
  id: Scalars["ID"];
  title: Scalars["String"];
};

export type User = {
  __typename?: "User";
  id: Scalars["ID"];
  todos: Array<Todo>;
};

export type TodosQueryVariables = Exact<{ [key: string]: never }>;

export type TodosQuery = {
  __typename?: "Query";
  session: {
    __typename?: "Session";
    currentUser: {
      __typename?: "User";
      todos: Array<{ __typename?: "Todo"; id: string; title: string }>;
    };
  };
};

export type RemoveTodoMutationVariables = Exact<{
  id: Scalars["String"];
}>;

export type RemoveTodoMutation = {
  __typename?: "Mutation";
  removeTodo?:
    | { __typename?: "Todo"; id: string; title: string }
    | null
    | undefined;
};

export type CreateTodoMutationVariables = Exact<{
  id: Scalars["String"];
  title: Scalars["String"];
}>;

export type CreateTodoMutation = {
  __typename?: "Mutation";
  createTodo: { __typename?: "Todo"; id: string; title: string };
};

export const TodosDocument = gql`
  query Todos {
    session {
      currentUser {
        todos {
          id
          title
        }
      }
    }
  }
`;

export function useTodosQuery(
  options: Omit<Urql.UseQueryArgs<TodosQueryVariables>, "query"> = {}
) {
  return Urql.useQuery<TodosQuery>({ query: TodosDocument, ...options });
}
export const RemoveTodoDocument = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id) {
      id
      title
    }
  }
`;

export function useRemoveTodoMutation() {
  return Urql.useMutation<RemoveTodoMutation, RemoveTodoMutationVariables>(
    RemoveTodoDocument
  );
}
export const CreateTodoDocument = gql`
  mutation CreateTodo($id: String!, $title: String!) {
    createTodo(input: { id: $id, title: $title }) {
      id
      title
    }
  }
`;

export function useCreateTodoMutation() {
  return Urql.useMutation<CreateTodoMutation, CreateTodoMutationVariables>(
    CreateTodoDocument
  );
}
