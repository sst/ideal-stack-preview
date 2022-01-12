function get(key: string) {
  const value = import.meta.env["VITE_" + key];
  if (!value) {
    alert(`${key} is missing in configuration`);
  }
  return value as string;
}

export const Config = {
  APOLLO_URL: get("APOLLO_URL"),
  COGNITO_USER_POOL_ID: get("COGNITO_USER_POOL_ID"),
  COGNITO_CLIENT_ID: get("COGNITO_CLIENT_ID"),
};

console.log("Config", Config);
