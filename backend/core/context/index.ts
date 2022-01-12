type Actor = UserActor | PublicActor;

type UserActor = {
  type: "user";
  properties: {
    id: string;
  };
};

type PublicActor = {
  type: "public";
};

export function useContext(actor: Actor) {
  return {
    actor,
    assertAuthenticated() {
      if (actor.type === "public") {
        throw new Error("Not authenticated");
      }
      return actor.properties;
    },
  };
}

export type Context = ReturnType<typeof useContext>;
