import { createContext, useContext, useState, useEffect } from "react";
import callApi from "../api";
import { useAuth } from "./AuthContext";

const AccountContext = createContext(null);

// Backend profile rows use profile_id / first_name; the UI expects id / name.
function toMember(profile) {
  return {
    id: profile.profile_id,
    name: profile.first_name,
    notificationsEnabled: profile.notifications_enabled,
  };
}

export function AccountProvider({ children }) {
  const [members, setMembers] = useState([]);
  const [activeMember, setActiveMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) {
      setMembers([]);
      setActiveMember(null);
    }
  }, [token]);

  function selectMember(member) {
    setActiveMember(member);
  }

  async function fetchMembers() {
    setIsLoading(true);
    try {
      const data = await callApi({ url: "/api/profiles", method: "GET", token });
      setMembers((data.profiles ?? []).map(toMember));
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
      body: { first_name: name },
    });
    setMembers((prev) => [...prev, toMember(data.profile)]);
  }

  async function removeMember(memberId) {
    await callApi({ url: `/api/profiles/${memberId}`, method: "DELETE", token });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  return (
    <AccountContext.Provider value={{ members, activeMember, isLoading, fetchMembers, addMember, removeMember, selectMember }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}
