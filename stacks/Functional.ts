import * as sst from "@serverless-stack/resources";

export type FunctionalStackProps = {
  app: sst.App;
  stack: sst.Stack;
};

export type FunctionalStack<T> = (
  props: FunctionalStackProps
) => T | Promise<T>;

let currentApp: sst.App | undefined;
let currentStack: FunctionalStack<any> | undefined;
const exportsCache: Record<string, any> = {};
const stackPropsCache = new Map<any, sst.StackProps>();

class EmptyStack extends sst.Stack {
  constructor(scope: sst.App, id: string) {
    const props = stackPropsCache.get(currentStack);
    super(scope, id, props);
  }
}

export function setStackProps(props: sst.StackProps) {
  stackPropsCache.set(currentStack, props);
}

export async function init(app: sst.App, ...fns: FunctionalStack<any>[]) {
  currentApp = app;
  for (const fn of fns) {
    currentStack = fn;
    const name = fn.name.toLowerCase();
    const exists = exportsCache[name];
    if (exists)
      throw new Error(`Attempting to initialize stack ${name} several times`);
    let stack: EmptyStack | undefined;
    const props = {
      app,
      get stack() {
        if (stack) return stack;
        stack = new EmptyStack(app, name);
        return stack;
      },
    };
    const result = await fn(props);
    if (!stack) stack = new EmptyStack(app, name);
    console.log(`Synthesized stack ${name}`);
    exportsCache[name] = result;
  }
}

export function use<T>(stack: FunctionalStack<T>): T {
  if (!currentApp) throw new Error("No app is set");
  const name = stack.name.toLowerCase();
  const exists = exportsCache[name];
  if (!exists)
    throw new Error(
      `Initialize "${name}" stack before "${currentStack?.name.toLowerCase()}" stack`
    );
  return exists;
}
