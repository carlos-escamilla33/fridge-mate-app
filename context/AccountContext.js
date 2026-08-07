import { createContext, useContext, useState, useEffect } from "react";
import callApi from "../api";
import { useAuth } from "./AuthContext";

const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) setMembers([]);
  }, [token]);

  async function fetchMembers() {
    setIsLoading(true);
    try {
      const data = await callApi({ url: "/api/account/members", method: "GET", token });
      setMembers(data.members);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function addMember(name) {
    const data = await callApi({
      url: "/api/accounts/register-profile",
      method: "POST",
      token,
      body: { name},
    });
    setMembers((prev) => [...prev, data.member]);
  }

  async function removeMember(memberId) {
    await callApi({ url: `/api/account/members/${memberId}`, method: "DELETE", token });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  return (
    <AccountContext.Provider value={{ members, isLoading, fetchMembers, addMember, removeMember }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
