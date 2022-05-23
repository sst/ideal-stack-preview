import { OperationContext, RequestPolicy, useQuery, useMutation } from "urql";
import { GraphQLTypes, InputType, ValueTypes } from "@my-sst-app/graphql/zeus";
import { ZeusTD } from "@my-sst-app/graphql/zeus/typedDocumentNode";
import { useEffect, useState } from "react";
import { TypedQueryDocumentNode } from "graphql";

export function useTypedQuery<
  O extends "Query",
  TData extends ValueTypes[O]
>(opts: {
  query: TData | ValueTypes[O];
  requestPolicy?: RequestPolicy;
  context?: Partial<OperationContext>;
  pause?: boolean;
}) {
  return useQuery<InputType<GraphQLTypes[O], TData>>({
    ...opts,
    query: ZeusTD("query", opts.query),
  });
}

export function useTypedMutation<
  O extends "Mutation",
  TData extends ValueTypes[O],
  Variables
>(query: (vars: Variables) => TData | ValueTypes[O]) {
  const [mutation, setMutation] = useState<TypedQueryDocumentNode>();
  const [result, execute] = useMutation<TData, Variables>(mutation as any);

  function executeWrapper(vars: Variables) {
    const mut = query(vars);
    setMutation(ZeusTD("mutation", mut));
  }

  useEffect(() => {
    if (!mutation) return;
    execute().then(() => setMutation(undefined));
  }, [mutation]);

  return [result, executeWrapper] as const;
}
