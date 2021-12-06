import "antd/dist/antd.css";
import classes from "./AuthForm.module.css";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { AppDispatch } from "../../store";
import { userAuthentication } from "../../store/auth-actions";
import LockOutlined from "@ant-design/icons/lib/icons/LockOutlined";
import UserOutlined from "@ant-design/icons/lib/icons/UserOutlined";
import React from "react";

const AuthForm = React.memo(() => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [signInsignUp, setSignInsignUp] = useState(true);

  const onFinish = async (value: { email: string; password: string }) => {
    await dispatch(
      userAuthentication(signInsignUp, value.email, value.password)
    );
    navigate("/cryptocurrencies/1");

    value.email = " ";
    value.password = " ";
  };

  const signInsignUpHandler = useCallback(() => {
    setSignInsignUp((prevState) => !prevState);
  }, [setSignInsignUp]);

  return (
    <div className={classes.formContainer}>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        size="large"
      >
        <div className={classes["form-title"]}>
          {" "}
          {signInsignUp ? "Please login" : "Create new account"}
        </div>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input
            type="email"
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
            minLength={6}
          />
        </Form.Item>
        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            {signInsignUp ? "LOGIN" : "REGISTER"}
          </Button>
          {" Or "}
          <a onClick={signInsignUpHandler}>
            {signInsignUp ? " REGISTER NOW" : " LOGIN NOW"}
          </a>
        </Form.Item>
      </Form>
    </div>
  );
});

export default AuthForm;
