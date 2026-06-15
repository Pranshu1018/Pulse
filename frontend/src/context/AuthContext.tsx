import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { currentUser, getMe, login as svcLogin, logout as svcLogout, signup as svcSignup, type PublicUser } from "../services/auth";

type Ctx = {
  user: PublicUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<PublicUser>;
  signup: (i: { username: string; email: string; password: string }) => Promise<PublicUser>;
  logout: () => void;
};

const AuthCtx = createContext<Ctx>({} as Ctx);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setReady(true);
        return;
      }
      
      try {
        const u = await getMe();
        setUser(u);
      } catch {
        // Token is invalid, clear it
        localStorage.removeItem("token");
        sessionStorage.removeItem("currentUser");
      } finally {
        setReady(true);
      }
    };
    restoreSession();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const u = await svcLogin(email, password);
    setUser(u);
    return u;
  }, []);

  const signup = useCallback(async (i: { username: string; email: string; password: string }) => {
    const u = await svcSignup(i);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    svcLogout();
    sessionStorage.removeItem("currentUser");
    setUser(null);
  }, []);

  return <AuthCtx.Provider value={{ user, ready, login, signup, logout }}>{children}</AuthCtx.Provider>;
}
