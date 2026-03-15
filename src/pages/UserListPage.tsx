import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Card, Space, Typography, message } from "antd";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useAdminStore } from "@/stores/adminStore";
import { listUsers } from "@/api/admin";
import type { AdminUserListItem } from "@/types";

export function UserListPage() {
  const navigate = useNavigate();
  const logout = useAdminStore((s) => s.logout);
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    listUsers()
      .then((data) => {
        if (!cancelled) setUsers(data);
      })
      .catch(() => message.error("加载用户列表失败"))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const columns: ColumnsType<AdminUserListItem> = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      render: (_, r) => (
        <Space>
          <UserOutlined />
          <Typography.Text strong>{r.username}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "用户 ID",
      dataIndex: "id",
      key: "id",
      ellipsis: true,
      width: 280,
    },
    {
      title: "注册时间",
      dataIndex: "created_at",
      key: "created_at",
      width: 180,
      render: (v: string) => dayjs(v).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "消息数",
      dataIndex: "message_count",
      key: "message_count",
      width: 90,
      align: "center",
    },
    {
      title: "摘要数",
      dataIndex: "summary_count",
      key: "summary_count",
      width: 90,
      align: "center",
    },
    {
      title: "锚点数",
      dataIndex: "anchor_count",
      key: "anchor_count",
      width: 90,
      align: "center",
    },
    {
      title: "操作",
      key: "action",
      width: 100,
      render: (_, r) => (
        <Button type="link" onClick={() => navigate(`/users/${r.id}`)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <Card
        title="用户列表"
        extra={
          <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate("/login", { replace: true }); }}>
            退出
          </Button>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
          loading={loading}
          pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `共 ${t} 人` }}
        />
      </Card>
    </div>
  );
}
