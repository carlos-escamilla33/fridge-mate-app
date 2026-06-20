import { createContext, useContext, useState, useEffect } from "react";
import callApi from "../api";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext(null);

const TOKEN_KEY = "fridgemate_token";
const USER_KEY = "fridgemate_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // ***Fix*** Look into how long the token stays valid in storage
  //           Right now I think the user is able to login and see the profiles screens even if its expired
  //          Meaning that the user will take the token and be redirected to the profiles and see user info
  //          It wont be till after they click on a profile that the app will have them relogin
  useEffect(() => {
    async function initialize() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUser = await SecureStore.getItemAsync(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // token is corrupt or missing, stay logged out
      } finally {
        setIsLoading(false);
      }
    }
    initialize();
  }, []);

  async function signIn(email, password) {
    try {
      const data = await callApi({
        url: "/api/auth/login",
        method: "POST",
        token: null,
        body: { email, password },
      });

      await persist(String(data.accessToken), String(data.account.user));
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function signOut() {
    try {
      await clearAllKeys();
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function register(account_name, first_name, email, password) {
    try {
      const data = await callApi({
        url: "/api/auth/register",
        method: "POST",
        token: null,
        body: { account_name, first_name, email, password },
      });

      await persist(data.accessToken, data.account.user);
      console.log(data);

      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async function persist(newToken, newUser) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_KEY, JSON.stringify(newUser));
      setToken(newToken);
      setUser(newUser);
    } catch (err) {
      console.log(err);
    }
  }

  async function clearAllKeys() {
    const keysToClear = [TOKEN_KEY, USER_KEY];

    for (const key of keysToClear) {
      await SecureStore.deleteItemAsync(key);
    }

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
