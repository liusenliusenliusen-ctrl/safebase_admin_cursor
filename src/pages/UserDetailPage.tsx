import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Descriptions, Typography, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { getUserDetail } from "@/api/admin";
import type { AdminUserDetail } from "@/types";

export function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    getUserDetail(userId)
      .then((data) => {
        if (!cancelled) setDetail(data);
      })
      .catch(() => message.error("加载用户详情失败"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId]);

  if (loading || !detail) {
    return (
      <div style={{ padding: 48, textAlign: "center" }}>
        <Spin size="large" />
      </div>
    );
  }

  const { user, profile_content, profile_updated_at, message_count, summary_count, anchor_count, recent_messages } = detail;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/users")}
        style={{ marginBottom: 16 }}
      >
        返回用户列表
      </Button>

      <Card title="基本信息" style={{ marginBottom: 16 }}>
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="用户 ID">{user.id}</Descriptions.Item>
          <Descriptions.Item label="用户名">{user.username}</Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {dayjs(user.created_at).format("YYYY-MM-DD HH:mm:ss")}
          </Descriptions.Item>
          <Descriptions.Item label="消息数">{message_count}</Descriptions.Item>
          <Descriptions.Item label="摘要数">{summary_count}</Descriptions.Item>
          <Descriptions.Item label="锚点数">{anchor_count}</Descriptions.Item>
        </Descriptions>
      </Card>

      {profile_content != null && (
        <Card
          title={
            profile_updated_at
              ? `画像（更新于 ${dayjs(profile_updated_at).format("YYYY-MM-DD HH:mm")}）`
              : "画像"
          }
          style={{ marginBottom: 16 }}
        >
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              margin: 0,
              fontSize: 13,
              lineHeight: 1.6,
              maxHeight: 400,
              overflow: "auto",
            }}
          >
            {profile_content || "（暂无）"}
          </pre>
        </Card>
      )}

      <Card title={`最近对话（共 ${recent_messages.length} 条）`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {recent_messages.length === 0 ? (
            <Typography.Text type="secondary">暂无消息</Typography.Text>
          ) : (
            recent_messages.map((m) => (
              <div
                key={m.id}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  background: m.role === "user" ? "#e6f4ff" : "#f5f5f5",
                  borderLeft: `3px solid ${m.role === "user" ? "#1890ff" : "#8c8c8c"}`,
                }}
              >
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  {m.role === "user" ? "用户" : "助手"} · {dayjs(m.created_at).format("MM-DD HH:mm")}
                </Typography.Text>
                <div style={{ marginTop: 4 }}>
                  <Typography.Text>{m.content}</Typography.Text>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}
