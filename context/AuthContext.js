import { createContext, useContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import {router} from "expo-router";

const AuthContext = createContext(null);

const TOKEN_KEY = "fridgemate_token";
const USER_KEY = "fridgemate_user";

const API_BASE = process.env.API_URL;

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // checking for token in storage for auto login
    // ***Fix*** Look into how long the token stays valid in storage
    //           Right now I think the user is able to login and see the profiles screens even if its expired
    //          Meaning that the user will take the token and be redirected to the profiles and see user into
    //          It wont be after they click on a profile that the app will have them relogin
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
                else {
                    router.replace("/(auth)/sign-in");
                }
            } catch {
                // token is corrupt or missing stay in auth
                router.replace("/(auth)/sign-in");
            } finally {
                setIsLoading(false);
            }
        })();
    }, [])

    async function signIn(email, password) {
        try {
            
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <AuthContext.Provider value={{user, token, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}