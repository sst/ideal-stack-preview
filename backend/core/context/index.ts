type Actor = UserActor;

type UserActor = {
  type: "user";
  properties: {
    id: string;
  };
};

export function useContext(actor: Actor) {
  return {
    actor,
  };
}

export type Context = ReturnType<typeof useContext>;
