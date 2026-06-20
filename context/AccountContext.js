import { createContext, useContext, useState } from "react";
import callApi from "../api";
import { useAuth } from "./AuthContext";

// Step 1: Create the context. This is the object that components will
//         subscribe to with useAccount(). It starts as null — the
//         provider below is what gives it its value at runtime.
const AccountContext = createContext(null);

export function AccountProvider({ children }) {
  // Step 2: Define state for everything account-level screens need.
  //         members  → shown on the profiles screen
  //         items    → shown on the home/fridge screen (add later)
  //         isLoading → true while fetching from the backend
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Step 3: Pull the token out of AuthContext so every API call here
  //         can attach it as a Bearer header without prop-drilling.
  const { token } = useAuth();

  // Step 4: Fetch all members for this account from the backend.
  //         Call this once when the profiles screen mounts (or after
  //         any mutation that might change the list on the server).
  async function fetchMembers() {
    setIsLoading(true);
    try {
      const data = await callApi({
        url: "/api/account/members",
        method: "GET",
        token,
      });
      setMembers(data.members);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Step 5: Add a new member. POST to the backend, then append the
  //         returned member to local state so the profiles screen
  //         re-renders immediately without a full re-fetch.
  async function addMember(name, avatarColor) {
    const data = await callApi({
      url: "/api/account/members",
      method: "POST",
      token,
      body: { name, avatar_color: avatarColor },
    });
    setMembers((prev) => [...prev, data.member]);
  }

  // Step 6: Remove a member by id. DELETE on the backend, then filter
  //         them out of local state.
  async function removeMember(memberId) {
    await callApi({
      url: `/api/account/members/${memberId}`,
      method: "DELETE",
      token,
    });
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  }

  // Step 7: Expose state and actions through the context value.
  //         Any component that calls useAccount() gets all of these.
  //         Add items-related state and actions here later following
  //         the same pattern as members.
  return (
    <AccountContext.Provider
      value={{ members, isLoading, fetchMembers, addMember, removeMember }}
    >
      {children}
    </AccountContext.Provider>
  );
}

// Step 8: Custom hook so components import one thing instead of
//         both useContext and AccountContext. The error guard catches
//         accidental usage outside of <AccountProvider>.
export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used inside <AccountProvider>");
  return ctx;
}

// Step 9: Wrap <AccountProvider> around the screens that need it.
//         In app/_layout.js, nest it inside <AuthProvider> (so the
//         token is already available when AccountProvider initializes):
//
//         <AuthProvider>
//           <AccountProvider>
//             <AuthGate />
//           </AccountProvider>
//         </AuthProvider>
//
// Step 10: In profiles.js, replace the hardcoded members array with:
//          const { members, fetchMembers, isLoading } = useAccount();
//          Call fetchMembers() inside a useEffect on mount.
//
// Step 11: In create-profile.js, replace router.back() in handleCreate
//          with a call to addMember(name, selectedColor), then navigate
//          back once the promise resolves.
