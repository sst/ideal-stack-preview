import * as sst from "@serverless-stack/resources";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Duration } from "aws-cdk-lib";

export class Database extends sst.Stack {
  public readonly outputs: {
    cluster: rds.ServerlessCluster;
  };

  constructor(scope: sst.App) {
    super(scope, "database");

    // Create VPC solely for RDS as it is required. Nothing should be using this.
    const vpc = new ec2.Vpc(this, "vpc", {
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public",
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "rds",
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    const cluster = new rds.ServerlessCluster(this, "cluster", {
      vpc,
      engine: rds.DatabaseClusterEngine.auroraPostgres({
        version: rds.AuroraPostgresEngineVersion.VER_10_14,
      }),
      enableDataApi: true,
      scaling: {
        autoPause: Duration.minutes(15),
      },
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
    });

    const migrator = new sst.Function(this, "migrator", {
      handler: "services/migrator/migrator.handler",
      bundle: {
        copyFiles: [
          {
            from: "./migrations",
            to: "backend/migrations",
          },
        ],
      },
      environment: {
        RDS_SECRET: cluster.secret!.secretArn,
        RDS_ARN: cluster.clusterArn,
        RDS_DATABASE: "acme",
      },
    });
    cluster.secret!.grantRead(migrator);
    cluster.grantDataApiAccess(migrator);

    this.outputs = {
      cluster,
    };
  }
}
