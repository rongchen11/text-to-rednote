import React, { useState } from 'react';
import { Modal, Form, Input, Button, Tabs, Space, Typography, Divider, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SafetyOutlined, 
  MailOutlined,
  GoogleOutlined,
  GithubOutlined 
} from '@ant-design/icons';
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

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      console.log('🚀 Google login clicked');
      message.info('Google login will be available after Supabase OAuth configuration');
      // TODO: Implement Google OAuth with Supabase
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: 'google',
      // });
    } catch (error) {
      console.error('Google login error:', error);
      message.error('Google login failed');
    }
  };

  // Handle GitHub login
  const handleGithubLogin = async () => {
    try {
      console.log('🚀 GitHub login clicked');
      message.info('GitHub login will be available after Supabase OAuth configuration');
      // TODO: Implement GitHub OAuth with Supabase
      // const { data, error } = await supabase.auth.signInWithOAuth({
      //   provider: 'github',
      // });
    } catch (error) {
      console.error('GitHub login error:', error);
      message.error('GitHub login failed');
    }
  };

  // Handle forgot password
  const handleForgotPassword = async () => {
    try {
      const email = loginForm.getFieldValue('email');
      if (!email) {
        message.warning('Please enter your email first');
        return;
      }
      console.log('🚀 Forgot password for:', email);
      message.info('Password reset functionality will be available after Supabase configuration');
      // TODO: Implement password reset with Supabase
      // const { error } = await supabase.auth.resetPasswordForEmail(email);
    } catch (error) {
      console.error('Forgot password error:', error);
      message.error('Failed to send reset email');
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
        <TabPane tab="Sign In" key="login">
          <Form
            form={loginForm}
            layout="vertical"
            onFinish={handleLogin}
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Input your email here"
                autoComplete="email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Input your password here"
                autoComplete="current-password"
                size="large"
              />
            </Form.Item>

            <Form.Item className="mb-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                block
                size="large"
                className="bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* Forgot Password Link */}
          <div className="text-center mb-4">
            <Button 
              type="link" 
              onClick={handleForgotPassword}
              className="text-gray-500 hover:text-gray-700"
            >
              Forgot password?
            </Button>
          </div>

          {/* Divider */}
          <Divider className="my-6">
            <span className="text-gray-400">OR</span>
          </Divider>

          {/* Third Party Login Buttons */}
          <div className="space-y-3">
            <Button
              icon={<GoogleOutlined />}
              onClick={handleGoogleLogin}
              block
              size="large"
              className="flex items-center justify-center h-12 border-gray-300 hover:border-gray-400"
            >
              <span className="ml-2">Sign in with Google</span>
            </Button>
            
            <Button
              icon={<GithubOutlined />}
              onClick={handleGithubLogin}
              block
              size="large"
              className="flex items-center justify-center h-12 border-gray-300 hover:border-gray-400 bg-gray-900 text-white hover:bg-gray-800"
            >
              <span className="ml-2">Sign in with GitHub</span>
            </Button>
          </div>
        </TabPane>

        <TabPane tab="Sign Up" key="register">
          <Form
            form={registerForm}
            layout="vertical"
            onFinish={handleRegister}
            size="large"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter email address' },
                { type: 'email', message: 'Please enter a valid email address' }
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Input your email here"
                autoComplete="email"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Username (Optional)"
              name="username"
              rules={[
                { min: 2, message: 'Username must be at least 2 characters' },
                { max: 20, message: 'Username must not exceed 20 characters' },
                { 
                  pattern: /^[a-zA-Z0-9_]+$/, 
                  message: 'Username can only contain letters, numbers, and underscores' 
                }
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Choose a display name (optional)"
                autoComplete="username"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter password' },
                { min: 6, message: 'Password must be at least 6 characters' },
                { max: 50, message: 'Password must not exceed 50 characters' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Input your password here"
                autoComplete="new-password"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
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
                placeholder="Confirm your password"
                autoComplete="new-password"
                size="large"
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
                className="bg-orange-400 hover:bg-orange-500 border-orange-400 hover:border-orange-500"
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