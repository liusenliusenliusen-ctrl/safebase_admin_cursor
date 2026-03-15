import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { useAdminStore } from "@/stores/adminStore";
import { listUsers } from "@/api/admin";

export function LoginPage() {
  const navigate = useNavigate();
  const { adminKey, setAdminKey } = useAdminStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (adminKey) {
      navigate("/users", { replace: true });
    }
  }, [adminKey, navigate]);

  const onFinish = async (values: { secret: string }) => {
    setLoading(true);
    try {
      setAdminKey(values.secret);
      await listUsers();
      message.success("验证成功");
      navigate("/users", { replace: true });
    } catch {
      message.error("密钥无效，请检查后端 ADMIN_SECRET 配置");
      useAdminStore.getState().logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "var(--bg-page)",
      }}
    >
      <Card
        title="管理后台登录"
        style={{ width: "100%", maxWidth: 400 }}
        headStyle={{ fontSize: 18 }}
      >
        <Form
          name="admin-login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="secret"
            label="管理员密钥"
            rules={[{ required: true, message: "请输入管理员密钥" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="与后端 ADMIN_SECRET 一致"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block size="large">
              进入后台
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
