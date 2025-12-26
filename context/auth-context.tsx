import callAPI from "@/api";
import { createContext } from "react";

type AuthContextType = {
    // user: 
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string| null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const signUp = async (email: string, password: string): Promise<string | null> => {
        try {
            const result = await callAPI({
                url: "api/auth/register",
                method: "POST",
                body: {email, password}
            });
            return result;
        } catch (err) {
            console.error("Signup failed", err);
            return null;
        }
    }

    const signIn = async (email: string, password: string): Promise<string | null> => {
        try {
            const result = await callAPI({
                url: "/api/auth/login",
                method: "POST",
                body: {email, password}
            });
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    return (
        <AuthContext.Provider value={{signUp, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

}