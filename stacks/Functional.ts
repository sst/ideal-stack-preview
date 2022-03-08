import * as sst from "@serverless-stack/resources";

export type FunctionalStackProps = {
  app: sst.App;
  stack: sst.Stack;
};

export type FunctionalStack<T> = (
  props: FunctionalStackProps
) => T | Promise<T>;

let currentApp: sst.App | undefined = undefined;
let currentStack: FunctionalStack<any> | undefined = undefined;
const exportsCache: Record<string, any> = {};
const stackPropsCache = new Map<any, sst.StackProps>();

class EmptyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);
  }
}

export async function init(app: sst.App, ...fns: FunctionalStack<any>[]) {
  currentApp = app;
  for (const fn of fns) {
    currentStack = fn;
    const name = fn.name.toLowerCase();
    const exists = exportsCache[name];
    if (exists)
      throw new Error(`Attempting to initialize stack ${name} several times`);
    const stackProps = stackPropsCache.get(fn);
    const stack = new EmptyStack(app, name, stackProps);
    const result = await fn({
      app,
      stack,
    });
    console.log(`Synthesized stack ${name}`);
    exportsCache[name] = result;
  }
}

export function defineStack<T>(props: sst.StackProps): FunctionalStack<T>;
export function defineStack<T>(cb: FunctionalStack<T>): FunctionalStack<T>;
export function defineStack<T>(
  props: sst.StackProps,
  cb: FunctionalStack<T>
): FunctionalStack<T>;
export function defineStack<T>(
  cb_or_props: FunctionalStack<T> | sst.StackProps,
  cb?: FunctionalStack<T>
) {
  const opts =
    typeof cb_or_props === "function"
      ? { cb: cb_or_props, props: undefined }
      : { cb, props: cb_or_props };
  if (opts.props) stackPropsCache.set(opts.cb, opts.props);
  return opts.cb;
}

export function OverrideStackProps(
  stack: FunctionalStack<any>,
  props: sst.StackProps
) {
  stackPropsCache.set(stack, props);
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
