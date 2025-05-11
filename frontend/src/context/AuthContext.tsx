import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";
import { ID, OAuthProvider, type Models } from "appwrite";
import { account } from "@/providers/appwrite-providers";

export type AuthState = "authenticated" | "unauthenticated" | "pending";

export type AuthContextType = {
  login: (email: string, password: string) => Promise<void>;
  loginWithDiscord: () => void;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    userId: string,
    secret: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  authState: AuthState;
  user?: Models.User<Models.Preferences> | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext hasn't been initialized");
  }
  return context;
};

export const SessionProvider = ({ children }: PropsWithChildren) => {
  const [authState, setAuthState] = useState<AuthState>("pending");
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null
  );

  // Check session on mount or when state is pending
  useEffect(() => {
    if (authState === "pending") {
      (async () => {
        try {
          const user = await account.get();
          setUser(user);
          setAuthState("authenticated");
        } catch {
          setAuthState("unauthenticated");
        }
      })();
    }
  }, [authState]);

  const login = useCallback(async (email: string, password: string) => {
    await account.createEmailPasswordSession(email, password);
    setAuthState("pending");
  }, []);

  const loginWithDiscord = useCallback(() => {
    // Appwrite web OAuth flow: open popup and wait for completion
    const url = account.createOAuth2Token(
      OAuthProvider.Discord,
      `${window.location.origin}/auth/callback`
    );
    if (url) {
      window.location.href = url;
    }
  }, []);

  const signUp = useCallback(
    async (email: string, password: string, name?: string) => {
      await account.create(ID.unique(), email, password, name);
      await login(email, password);
      setAuthState("pending");
    },
    [login]
  );

  const resetPassword = useCallback(
    async (userId: string, secret: string, password: string) => {
      await account.updateRecovery(userId, secret, password);
    },
    []
  );

  const forgotPassword = useCallback(async (email: string) => {
    // Appwrite will send a recovery email with a link to your frontend
    const redirectUrl = `${window.location.origin}/reset-password`;
    await account.createRecovery(email, redirectUrl);
  }, []);

  const logout = useCallback(async () => {
    await account.deleteSession("current");
    setAuthState("pending");
  }, []);

  return (
    <AuthContext.Provider
      value={{
        login,
        signUp,
        logout,
        authState,
        loginWithDiscord,
        resetPassword,
        forgotPassword,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
