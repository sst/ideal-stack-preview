import { App, Function as Fn } from "@serverless-stack/resources";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { StringParameter } from "aws-cdk-lib/aws-ssm";
import { Construct } from "constructs";
type Props = {
  name: string;
} & (
  | {
      value?: string;
    }
  | { encrypted: true }
);
export class Parameter extends Construct {
  public readonly path: string;
  public readonly resource: string;
  constructor(scope: Construct, props: Props) {
    super(scope, props.name);
    const app = App.of(scope) as App;
    this.path = `/${app.name}/${app.stage}/${props.name}`;
    this.resource = `arn:aws:ssm:${app.region}:${app.account}:parameter${this.path}`;
    if ("encrypted" in props && props.encrypted) {
      return;
    }

    if ("value" in props && props.value) {
      new StringParameter(this, props.name, {
        parameterName: this.path,
        stringValue: props.value,
      });
    }
  }

  public static use(func: Fn, ...params: Parameter[]) {
    const env = params.map((p) => p.path).join(",");
    const policy = new PolicyStatement({
      resources: params.map((p) => p.resource),
      actions: ["*"],
      effect: Effect.ALLOW,
    });
    func.addToRolePolicy(policy);
    func.addEnvironment("SSM_VALUES", env);
  }
}
