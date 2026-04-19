import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

const AuthContext = createContext(null);

const TOKEN_KEY = "fridgemate_token";
const USER_KEY = "fridgemate_user";

const API_BASE = processColor.env.API_URL;

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // checking for token in storage for auto login
    useEffect(() => {
        (async () => {
            try {
                const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
                const storedUser = await SecureStore.getItemAsync(USER_KEY);

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    router.replace("/(app)/profiles");
                }
            } catch {
                // token is corrupt or missing stay in auth
            } finally {
                setIsLoading(false);
            }
        })();
    }, [])
}