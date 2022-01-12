type Keys =
  | "RDS_SECRET"
  | "RDS_ARN"
  | "RDS_DATABASE"
  | "COGNITO_USER_POOL_ID"
  | "COGNITO_CLIENT_ID"
  | "BUCKET";

export function config(key: Keys) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable "${key}"`);
  return value;
}
