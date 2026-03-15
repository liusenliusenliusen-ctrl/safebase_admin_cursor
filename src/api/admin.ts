import { adminApi } from "./client";
import type { AdminUserDetail, AdminUserListItem } from "@/types";

export async function listUsers(): Promise<AdminUserListItem[]> {
  const { data } = await adminApi.get<AdminUserListItem[]>("/api/admin/users");
  return data;
}

export async function getUserDetail(
  userId: string,
  messagesLimit = 50
): Promise<AdminUserDetail> {
  const { data } = await adminApi.get<AdminUserDetail>(
    `/api/admin/users/${userId}`,
    { params: { messages_limit: messagesLimit } }
  );
  return data;
}
