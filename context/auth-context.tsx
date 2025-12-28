import callAPI from "@/api";
import { createContext, useContext } from "react";

type AuthContextType = {
    // user: 
    signUp: (email: string, password: string) => Promise<object | null>;
    signIn: (email: string, password: string) => Promise<object | null>;
}

interface AuthSignUpResponse {
  message: string ;
  account: any;
  profile: any;
  accessToken: string;
  refreshToken: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const signUp = async (email: string, password: string): Promise<object | null> => {
        try {
            const result: AuthSignUpResponse = await callAPI({
                url: "api/auth/register",
                method: "POST",
                body: {email, password}
            });
            console.log(result);
            return result;
        } catch (err) {
            console.error("Signup failed", err);
            return null;
        }
    }

    const signIn = async (email: string, password: string): Promise<object | null> => {
        try {
            const result = await callAPI({
                url: "api/auth/login",
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
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be inside of the AuthProvider");
    }
    return context;
}