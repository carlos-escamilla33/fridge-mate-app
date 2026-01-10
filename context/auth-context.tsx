import callAPI from "@/api";
import { createContext, useContext } from "react";

interface AuthSignUpResponse {
  message: string ;
  accessToken: string;
  refreshToken: string;
  account: {
    account_id: number;
    email: string;
    account_name: string | null;
    created_at: string;
    reset_token: string | null;
    reset_token_expiry: string | null;
  };
  profile: {
    profile_id: number;
    account_id: number;
    first_name: string | null;
    last_name: string | null;
    notifications_enabled: boolean;
    created_at: string;
  }
}

interface Profile {
    first_name: string;
    last_name: string;
    notifications_enabled: boolean;
    created_at: string;
    account_id: number;
}

interface AuthSignInResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    account: {
        account_id: number;
        email: string;
        account_name: string | null;
        created_at: string;
        reset_token: string | null;
        reset_token_expiry: string | null;
    }
    profiles: Profile[];
}



type AuthContextType = {
    // profile: Profile | null;
    signUp: (account_name: string, first_name: string, last_name: string, email: string, password: string) => Promise<AuthSignUpResponse | null>;
    signIn: (email: string, password: string) => Promise<AuthSignInResponse | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}: {children: React.ReactNode}) {
    // const [profile, setProfile] = useState<Profile | null>(null);

    const signUp = async (account_name: string, first_name: string,
         last_name: string, email: string, password: string): Promise<AuthSignUpResponse | null> => {
        try {
            const result: AuthSignUpResponse = await callAPI({
                url: "api/auth/register",
                method: "POST",
                body: {account_name, first_name, last_name, email, password}
            });
           
            return result;
        } catch (err) {
            console.error("Signup failed", err);
            return null;
        }
    }

    const signIn = async (email: string, password: string): Promise<AuthSignInResponse | null> => {
        try {
            const result: AuthSignInResponse = await callAPI({
                url: "api/auth/login",
                method: "POST",
                body: {email, password}
            });
            console.log(result);
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