/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { getUsers } from "../services/getUser";
import { addUser } from "../services/addUser";

export function useUserHooks() {
  const [users, setUsers] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setuserError] = useState<string | null>(null);
  const [addUserError, setAddUserError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setUserLoading(true);
    try {
      const response = await getUsers();
      setUsers(response);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      setuserError(error.message || "Failed to fetch stocked data");
    } finally {
      setUserLoading(false);
    }
  };

  const handleAddUser = async (
    username: string,
    email: string,
    password: string,
    role: string,
    warehouseId: string
  ) => {
    try {
      const response = await addUser(
        username,
        email,
        password,
        role,
        warehouseId
      );
      if (response) {
        setUsers(response);
        fetchUsers();
      }
    } catch (error: any) {
      console.error("Error adding user:", error);
      setAddUserError(error.message || "Failed to add user");
    }
  };

  return {
    users,
    userLoading,
    userError,
    addUserError,
    addUser: handleAddUser,
    refetchuser: fetchUsers,
  };
}
