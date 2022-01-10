import {
  createContext,
  Dispatch,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
} from "amazon-cognito-identity-js";
import { Config } from "./config";
import { Navigate } from "react-router-dom";

type AuthContextType = {
  isBootstrapping: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<[AuthContextType, Dispatch<AuthContextType>]>(
  [] as any
);

export function AuthProvider(props: PropsWithChildren<{}>) {
  const [auth, setAuth] = useState<AuthContextType>({
    isBootstrapping: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const user = userPool.getCurrentUser();
    if (!user) {
      setAuth({
        ...auth,
        isBootstrapping: false,
      });
      return;
    }
    user.getSession((err: Error, session: any) => {
      if (!err) {
        localStorage.setItem("token", session.getIdToken().getJwtToken());
        setAuth({
          ...auth,
          isBootstrapping: false,
        });
        return;
      }
      setAuth({
        ...auth,
        isBootstrapping: false,
      });
    });
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {props.children}
    </AuthContext.Provider>
  );
}

const userPool = new CognitoUserPool({
  UserPoolId: Config.COGNITO_USER_POOL_ID,
  ClientId: Config.COGNITO_CLIENT_ID,
});

export function useAuth() {
  const [authContext, setAuthContext] = useContext(AuthContext);

  function login(email: string, password: string) {
    const user = new CognitoUser({
      Username: email,
      Pool: userPool,
    });

    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });

    return new Promise((resolve, reject) => {
      user.authenticateUser(authDetails, {
        onSuccess: (result) => {
          const token = result.getAccessToken().getJwtToken();
          localStorage.setItem("token", token);
          setAuthContext({
            ...authContext,
            isAuthenticated: true,
          });
          resolve(result);
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  function register(email: string, password: string) {
    return new Promise<void>((resolve, reject) => {
      userPool.signUp(
        email,
        password,
        [
          new CognitoUserAttribute({
            Name: "email",
            Value: email,
          }),
        ],
        [],
        (err) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        }
      );
    });
  }

  return {
    register,
    login,
    ...authContext,
  };
}

export function NeedsAuth(
  props: React.PropsWithChildren<{
    redirectTo: string;
  }>
) {
  const auth = useAuth();

  if (auth.isBootstrapping) return <span>Loading...</span>;
  if (!auth.isAuthenticated) return <Navigate to={props.redirectTo} />;

  return <>{props.children}</>;
}
