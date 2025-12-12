import { useState, useEffect } from "react";
import { getUsers } from "../services/getUser";
import { User } from "@/types/admin";

export function useUserHooks() {
  const [users, setUsers] = useState<User[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err: any) {
      setUserError(err.message);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    userLoading,
    userError,
    refetchuser: fetchUsers,
  };
}
