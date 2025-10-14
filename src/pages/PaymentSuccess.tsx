import React, { useEffect, useState } from 'react';
import { Result, Button, Card, Typography, Spin } from 'antd';
import { CheckCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuthStore } from '../stores/useAuthStore';

const { Title, Paragraph } = Typography;

export const PaymentSuccess: React.FC = () => {
  const { user, initializeAuth } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 刷新用户信息以获取最新积分
    const refreshUserData = async () => {
      try {
        await initializeAuth();
      } catch (error) {
        console.error('刷新用户信息失败:', error);
      } finally {
        setLoading(false);
      }
    };

    // 延迟一下再刷新，确保支付回调已处理
    const timer = setTimeout(refreshUserData, 2000);
    
    return () => clearTimeout(timer);
  }, [initializeAuth]);

  const handleBackToHome = () => {
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md text-center">
          <Spin size="large" />
          <div className="mt-4">
            <Title level={4}>Confirming payment result...</Title>
            <Paragraph className="text-gray-600">
              Please wait, we are verifying your payment status
            </Paragraph>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <Result
          icon={<CheckCircleOutlined className="text-green-500" />}
          status="success"
          title="Payment Successful!"
          subTitle="Congratulations! Your credits purchase was successful and has been automatically added to your account."
          extra={[
            <div key="user-info" className="mb-6">
              {user && (
                <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
                  <div className="text-center">
                    <Title level={4} className="mb-2">
                      Account Information
                    </Title>
                    <div className="flex justify-center items-center space-x-6">
                      <div>
                        <div className="text-gray-600">Username</div>
                        <div className="font-semibold">{user.username}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Current Credits</div>
                        <div className="text-2xl font-bold text-blue-600">
                          💎 {user.credits?.toLocaleString()} credits
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>,
            <div key="actions" className="space-x-4">
              <Button type="primary" size="large" icon={<HomeOutlined />} onClick={handleBackToHome}>
                Back to Home
              </Button>
            </div>
          ]}
        >
          <div className="text-center space-y-4">
            <Card className="bg-green-50 border-green-200">
              <Title level={5} className="text-green-800 mb-3">
                🎉 Payment Complete
              </Title>
              <div className="text-left space-y-2 text-green-700">
                <div>✅ Payment processed successfully</div>
                <div>✅ Credits automatically added to your account</div>
                <div>✅ You can now start using credits to generate RedNote images</div>
                <div>✅ Credits are permanent with no expiration date</div>
              </div>
            </Card>
            
            <Card>
              <Title level={5} className="mb-3">
                💡 Usage Guide
              </Title>
              <div className="text-left space-y-1 text-gray-600">
                <div>• Generate 1 RedNote image costs 20 credits</div>
                <div>• AI intelligent text splitting is free to use</div>
                <div>• You can check credit balance and usage history anytime</div>
                <div>• If you need more credits, you can return to the recharge page anytime</div>
              </div>
            </Card>
          </div>
        </Result>
      </Card>
    </div>
  );
};
