export interface AdminUserListItem {
  id: string;
  username: string;
  created_at: string;
  message_count: number;
  summary_count: number;
  anchor_count: number;
}

export interface UserOut {
  id: string;
  username: string;
  created_at: string;
}

export interface MessageItem {
  id: number;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface AdminUserDetail {
  user: UserOut;
  profile_content: string | null;
  profile_updated_at: string | null;
  message_count: number;
  summary_count: number;
  anchor_count: number;
  recent_messages: MessageItem[];
}
