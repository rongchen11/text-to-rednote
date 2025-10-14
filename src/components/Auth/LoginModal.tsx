import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, Space, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/useAuthStore';
import type { SignUpData, SignInData } from '../../services/supabaseClient';

const { Text, Title } = Typography;
const { TabPane } = Tabs;

interface LoginModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ visible, onClose }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();
  
  const { signIn, signUp, isLoading } = useAuthStore();

  // Handle login
  const handleLogin = async () => {
    try {
      console.log('🚀 Login button clicked - starting login process');
      const values = await loginForm.validateFields();
      console.log('✅ Login form validation passed:', values);
      
      const success = await signIn(values as SignInData);
      console.log('📊 Login result:', success);
      
      if (success) {
        console.log('✅ Login successful - closing modal');
        onClose();
        loginForm.resetFields();
      } else {
        console.log('❌ Login failed - staying on form');
        // Error message will be shown by the store via message.error()
      }
    } catch (error) {
      console.error('❌ Login form validation failed:', error);
      alert('Form validation failed: ' + error);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    try {
      console.log('🚀 Sign Up button clicked - starting registration process');
      const values = await registerForm.validateFields();
      console.log('✅ Form validation passed:', values);
      
      const success = await signUp(values as SignUpData);
      console.log('📊 Sign Up result:', success);
      
      if (success) {
        console.log('✅ Registration successful - closing modal');
        onClose();
        registerForm.resetFields();
      } else {
        console.log('❌ Registration failed - staying on form');
        // Add visual feedback for failed registration
        alert('Registration failed. Please check the error message above.');
      }
    } catch (error) {
      console.error('❌ Register form validation failed:', error);
      alert('Form validation failed: ' + error);
    }
  };

  // Reset forms when closing modal
  const handleClose = () => {
    loginForm.resetFields();
    registerForm.resetFields();
    onClose();
  };

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={400}
      centered
      destroyOnClose
    >
      <div className="text-center mb-6">
        <Title level={3} className="mb-2">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </Title>
        <Text type="secondary">
          {activeTab === 'login' 
            ? 'Sign in to your account to continue' 
            : 'Sign up for a new account, get 100 credits instantly'
          }
        </Text>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={(key) => setActiveTab(key as 'login' | 'register')}
        centered
        size="large"
      >
        <TabPane tab="Login" key="login">
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={handleLogin}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please enter username' },
                { min: 2, message: 'Username must be at least 2 characters' }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter password' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Login
              </Button>
            </Form.Item>
          </Form>
        </TabPane>

        <TabPane tab="Sign Up" key="register">
          <Form
            form={registerForm}
            layout="vertical"
            onFinish={handleRegister}
            size="large"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please enter username' },
                { min: 2, message: 'Username must be at least 2 characters' },
                { max: 20, message: 'Username must not exceed 20 characters' },
                { 
                  pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, 
                  message: 'Username can only contain letters, numbers, underscores and Chinese characters' 
                }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Username"
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 50, message: 'Password must not exceed 50 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                { required: true, message: 'Please confirm password' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('The two passwords do not match'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<SafetyOutlined />}
                placeholder="Confirm Password"
                autoComplete="new-password"
              />
            </Form.Item>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <Space direction="vertical" size="small" className="w-full">
                <Text type="secondary" className="text-sm">
                  🎁 Sign Up Benefits
                </Text>
                <Text className="text-sm">
                  • Get <Text strong className="text-blue-600">100 credits</Text> for first-time registration
                </Text>
                <Text className="text-sm">
                  • Credits can be used for AI image generation and other features
                </Text>
              </Space>
            </div>

            <Form.Item className="mb-0">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>
        </TabPane>
      </Tabs>

      <Divider />
      
      <div className="text-center">
        <Text type="secondary" className="text-xs">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </div>
    </Modal>
  );
};