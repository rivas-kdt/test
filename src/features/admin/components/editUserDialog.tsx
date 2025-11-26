"use client";

import { useEffect, useState } from "react";
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
import type { Users } from "@/app/admin/page";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface EditUserDialogProps {
  user: Users;
  locations: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditUserDialog({
  user,
  locations,
  open,
  onOpenChange,
  onSuccess,
}: EditUserDialogProps) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const t = useTranslations("editUser")

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        role: user.role || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const payload = {
        userId: user.id,
        username:
          formData.username !== user.username ? formData.username : undefined,
        email: formData.email !== user.email ? formData.email : undefined,
        role: formData.role !== user.role ? formData.role : undefined,
        location:
          formData.location !== user.location ? formData.location : undefined,
      };

      const response = await fetch("/api/v2/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (result.success) {
        router.refresh();
        onOpenChange(false);
        onSuccess?.();
      } else {
        console.error("Error updating user:", result.error);
      }
    } catch (error) {
      console.error("Exception in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('header')}</DialogTitle>
          <DialogDescription>
            {t('description')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              {t('username')}
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              {t('email')}
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              {t('role')}
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">{t('admin')}</SelectItem>
                <SelectItem value="worker">{t('worker')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-400 hover:bg-amber-400/75 text-black"
          >
            {isLoading ? t("addingState") : t('button')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
