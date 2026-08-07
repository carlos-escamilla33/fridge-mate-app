import { createContext, useContext, useState, useEffect } from "react";
import callApi from "../api";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

const TOKEN_KEY = "fridgemate_token";
const USER_KEY = "fridgemate_user";

function isTokenExpired(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(base64));
    return !payload.exp || payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initialize() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          if (isTokenExpired(storedToken)) {
            await SecureStore.deleteItemAsync(TOKEN_KEY);
            await SecureStore.deleteItemAsync(USER_KEY);
          } else {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          }
        }
      } catch {
        // corrupt storage — stay logged out
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  async function signIn(email, password) {
    const data = await callApi({
      url: "/api/auth/login",
      method: "POST",
      token: null,
      body: { email, password },
    });
    await persist(data.accessToken, buildUser(data));
    return data;
  }

  async function signOut() {
    await clearAllKeys();
  }

  async function register(account_name, first_name, email, password) {
    const data = await callApi({
      url: "/api/auth/register",
      method: "POST",
      token: null,
      body: { account_name, first_name, email, password },
    });
    await persist(data.accessToken, buildUser(data));
    return data;
  }

  function buildUser(data) {
    return {
      id: data.profile?.profile_id ?? data.account?.account_id,
      name: data.profile?.first_name,
      email: data.account?.email,
      account_id: data.account?.account_id,
      account_name: data.account?.account_name,
    };
  }

  async function persist(newToken, newUser) {
    const tokenStr = String(newToken ?? '');
    const userStr = JSON.stringify(newUser ?? null);
    await SecureStore.setItemAsync(TOKEN_KEY, tokenStr);
    await SecureStore.setItemAsync(USER_KEY, userStr);
    setToken(tokenStr);
    setUser(newUser ?? null);
  }

  async function clearAllKeys() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, register, signOut, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
