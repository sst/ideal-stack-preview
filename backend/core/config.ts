type Keys = "RDS_SECRET" | "RDS_ARN" | "RDS_DATABASE";

export function config(key: Keys) {
  const value = process.env[key];
  if (!value) throw new Error(`Missing environment variable "${key}"`);
  return value;
}
