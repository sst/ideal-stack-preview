## Ideal Stack Preview

This is a preview of the upcoming ideal stack. It is a modern starter that contains everything you need to ship full-stack serverless applications. It's built on top of SST and has tools like GraphQL already setup.

You can checkout a demo of it given at our v1 Conf [here](https://youtu.be/6FzLjpMYcu8?t=5182)

### Getting started

This is a standard SST app so you can bring everything up with `yarn start`

### File Structure

```
backend
├── core
├── functions
    ├── graphql
├── migrations
stacks
graphql
web
```

- `backend` - Package that contains all backend code, both business logic and functions
  - `core` - Contains pure business logic. Should implement features here, do things like read/write to the database.
  - `functions` - Contains handlers for lambda functions. These should not contain much business logic and instead import from `core` to coordinate work
    - `graphql` - This is the function for the GraphQL server. It uses Pothos to define the schema + resolvers in native typescript. You can view documentation for that library [here](https://pothos-graphql.dev/)
  - `migrations` - This stack currently uses the `sst.RDS` construct and this folder contains migrations. This isnt mandatory, you can use any database you want including DynamoDB
- `stacks` - Standard SST stacks folder. Currently contains an API configured for graphql, an RDS cluster, and a static site for the frontend
- `graphql` - The new API route for graphql will handle codegeneration from pothos definitions and this is the folder it goes into. It's currently setup to generate a [genql](https://genql.vercel.app/) client for use in tests and the frontend but you can configure whatever codegen steps you want.
- `web` - A standard React application created with [vite](https://vitejs.dev/) configured with URQL to use as the GraphQL client. It has helpers in there to bring typesafety features through genql.
