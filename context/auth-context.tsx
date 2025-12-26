import { createContext } from "react";

type AuthContextType = {
    // user: 
    signUp: (email: string, password: string) => Promise<string | null>;
    signIn: (email: string, password: string) => Promise<string| null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const signUp = async (email: string, password: string) => {
        try {
            await account
        } catch (err) {
            
        }
    }

    return (
        <AuthContext.Provider value={{user, signUp, signIn}}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {

}