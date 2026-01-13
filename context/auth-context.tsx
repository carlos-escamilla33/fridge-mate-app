import callAPI from "@/api";
import { createContext, useContext, useState } from "react";

interface Account {
    account_id: number;
    email: string;
    account_name: string | null;
    created_at: string;
    reset_token: string | null;
    reset_token_expiry: string | null;
}

export interface Profile {
    profile_id: number;
    first_name: string;
    last_name: string;
    notifications_enabled: boolean;
    created_at: string;
    account_id: number;
}

interface AuthSignUpResponse {
  message: string ;
  accessToken: string;
  refreshToken: string;
  account: Account;
  profile: Profile;
}

interface AuthSignInResponse {
    message: string;
    accessToken: string;
    refreshToken: string;
    account: Account;
    profiles: Profile[];
}

interface AuthProfileSignUpResponse {
    message: string;

}



type AuthContextType = {
    account: Account | null;
    currentProfile: Profile | null;
    setCurrentProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
    profiles: Profile[] | [];
    signUp: (account_name: string, first_name: string, last_name: string, email: string, password: string) => Promise<boolean>;
    signIn: (email: string, password: string) => Promise<boolean>;
    profileSignUp: (first_name: string, last_name: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function AuthProvider({children}: {children: React.ReactNode}) {
    const [account, setAccount] = useState<Account | null>(null);
    const [token, setToken] = useState<string>("");
    const [profiles, setProfiles] = useState<Profile[] | []>([]);
    const [currentProfile, setCurrentProfile] = useState<Profile | null>(null);

    const signUp = async (account_name: string, first_name: string,
         last_name: string, email: string, password: string): Promise<boolean> => {
        try {
            const res: AuthSignUpResponse = await callAPI({
                url: "api/auth/register",
                method: "POST",
                body: {account_name, first_name, last_name, email, password}
            });

            if (res.message === "You Successfully Registered!") {
                setAccount(res.account);
                setCurrentProfile(res.profile);
                setToken(res.accessToken);
                return true;
            }
           
            return false;
        } catch (err) {
            console.error("Signup failed", err);
            return false;
        }
    }

    const signIn = async (email: string, password: string): Promise<boolean> => {
        try {
            const res: AuthSignInResponse = await callAPI({
                url: "api/auth/login",
                method: "POST",
                body: {email, password}
            });
            console.log(res);
            if (res.message === "You Successfully Logged In!") {
                setAccount(res.account);
                setProfiles(res.profiles);
                setToken(res.accessToken);
                return true;
            }

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    const profileSignUp = async (first_name: string, last_name: string): Promise<boolean> => {
        try {
            const res: AuthProfileSignUpResponse = await callAPI({
                url: "api/accounts/register-profile",
                method: "POST",
                body: {first_name, last_name},
                token
            });

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    return (
        <AuthContext.Provider value={{account, profiles, currentProfile, setCurrentProfile, signUp, signIn, profileSignUp}}>
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