"use server";
import { cookies } from "next/headers";

export async function create(data: string) {
  const cookieStore = await cookies();
  cookieStore.set("jwt", data, { secure: true });
}

export async function get(data: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get(data);
  return token?.value;
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("jwt");
}