import * as sst from "@serverless-stack/resources";

export type Context = {
  app: sst.App;
  stack: sst.Stack;
  setStackProps: ReturnType<typeof createSetStackProps>;
};

export type FunctionalStack<T> = (props: Context) => T | Promise<T>;

let currentApp: sst.App | undefined;
let currentStack: FunctionalStack<any> | undefined;

interface StackProps extends sst.StackProps {
  id?: string;
}

const exportsCache = new Map<FunctionalStack<any>, any>();
const stackPropsCache = new Map<FunctionalStack<any>, StackProps>();

class EmptyStack extends sst.Stack {
  constructor(scope: sst.App, fn: FunctionalStack<any>, id: string) {
    const props = stackPropsCache.get(fn);
    super(scope, props?.id || id, props);
  }
}
function createSetStackProps(fn: FunctionalStack<any>) {
  return (props: StackProps) => {
    // TODO throw an error if current stack has been initialized
    stackPropsCache.set(fn, props);
  };
}

export function use<T>(stack: FunctionalStack<T>): T {
  if (!currentApp) throw new Error("No app is set");
  const exists = exportsCache.get(stack);
  if (!exists) {
    throw new Error(
      `Initialize "${stack.name.toLowerCase()}" stack before "${currentStack?.name.toLowerCase()}" stack`
    );
  }
  return exists;
}

interface StackBuilder {
  stack<T extends FunctionalStack<any>>(
    fn: T
  ): ReturnType<T> extends Promise<any> ? Promise<void> : StackBuilder;
}

export function IgnoreThisWillBeRemoved(app: sst.App) {
  currentApp = app;
  const result: StackBuilder = {
    stack<T extends FunctionalStack<any>>(
      fn: T
    ): ReturnType<T> extends Promise<any> ? Promise<void> : StackBuilder {
      currentStack = fn;
      const name = fn.name.toLowerCase();
      const exists = exportsCache.has(fn);
      if (exists)
        throw new Error(`Attempting to initialize stack ${name} several times`);
      let stack: EmptyStack | undefined;
      const props: Context = {
        app,
        // Stack is lazily created on first get ie. `props.stack` inside the
        // functional stack. This allows functional stack to call `setStackProps`
        // before the stack is created.
        get stack() {
          if (stack) return stack;
          stack = new EmptyStack(app, fn, name);
          return stack;
        },
        setStackProps: createSetStackProps(fn),
      };
      const returns = fn(props);
      if ("then" in returns)
        return returns.then((data: any) => {
          exportsCache.set(fn, data);
        });

      exportsCache.set(fn, returns);
      return result as any;
    },
  };

  return result;
}
