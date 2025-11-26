"use client";
import type React from "react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
// import { supabase } from "@/lib/supabaseClient"; //TODO Change this
import { useTranslations } from "next-intl";
import { getWarehouse } from "../services/getWarehouse";
import { addUser } from "../services/addUser";
import toast from "react-hot-toast";

interface AddUserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserAdded?: () => void;
}

export function AddUserForm({
  open,
  onOpenChange,
  onUserAdded,
}: AddUserFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("worker");
  const [warehouseId, setWarehouseId] = useState("");
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingWarehouses, setFetchingWarehouses] = useState(false);
  const t = useTranslations("addNewUser");

  useEffect(() => {
    if (open) {
      fetchWarehouses();
    }
  }, [open]);

  // const fetchWarehouses = async () => {
  //   setFetchingWarehouses(true);
  //   try {
  //     const { data, error } = await supabase
  //       .from("warehouse")
  //       .select("id, warehouse, location")
  //       .order("warehouse", { ascending: true });

  //     if (error) throw error;
  //     setWarehouses(data || []);
  //   } catch (error) {
  //     console.error("Error fetching warehouses:", error);
  //   } finally {
  //     setFetchingWarehouses(false);
  //   }
  // };

  const fetchWarehouses = async () => {
    setFetchingWarehouses(true);
    try {
      const response = await getWarehouse();
      setWarehouses(response);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setFetchingWarehouses(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await addUser(
        username,
        email,
        password,
        role,
        warehouseId
      );
      setTimeout(() => {
        toast.success(`User added successfully: ${result}`);
      }, 0);
      resetForm();
      onOpenChange(false);
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setRole("worker");
    setWarehouseId("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className=" text-amber-400">{t("header")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                {t("username")}
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                {t("email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                {t("password")}
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                {t("role")}
              </Label>
              <Select value={role} onValueChange={setRole} required>
                <SelectTrigger id="role" className="col-span-3">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t("admin")}</SelectItem>
                  <SelectItem value="worker">{t("worker")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === "worker" && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="warehouse" className="text-right">
                  {t("warehouses")}
                </Label>
                <Select
                  value={warehouseId}
                  onValueChange={setWarehouseId}
                  required
                >
                  <SelectTrigger id="warehouse" className="col-span-3">
                    <SelectValue placeholder={t("selectWarehouse")} />
                  </SelectTrigger>
                  <SelectContent>
                    {fetchingWarehouses ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>{t("loadingState")}</span>
                      </div>
                    ) : (
                      warehouses.map((warehouse) => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.warehouse} ({warehouse.location})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
              className="  bg-amber-400 hover:bg-amber-300"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("addingState")}
                </>
              ) : (
                t("button")
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
