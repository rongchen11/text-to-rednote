import React, { useState } from 'react';
import { Modal, Card, Typography, message, Button } from 'antd';
import { CrownOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { LoginModal } from '../Auth/LoginModal';

const { Text } = Typography;

interface SimpleCreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

// 简化的购买选项 - 使用 Creem 直接支付链接
const PURCHASE_OPTIONS = [
  {
    id: 'basic',
    price: 5,
    credits: 100,
    label: 'Standard',
    description: 'Great for getting started',
    product_id: 'prod_6vVTmdcL0l4O0D28hZk25L',
    payment_link: 'https://www.creem.io/payment/prod_6vVTmdcL0l4O0D28hZk25L',
    popular: true
  },
  {
    id: 'unlimited', 
    price: 599,
    credits: 15000,
    label: 'Unlimited',
    description: 'One-time purchase, unlimited access',
    product_id: 'prod_5okTWJRCBjkApBlR7pEUnh',
    payment_link: 'https://www.creem.io/payment/prod_5okTWJRCBjkApBlR7pEUnh',
    popular: false
  }
];

export const SimpleCreditsModal: React.FC<SimpleCreditsModalProps> = ({
  visible,
  onClose,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (option: typeof PURCHASE_OPTIONS[0]) => {
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    try {
      setLoading(option.id);
      
      message.info('Redirecting to payment page...');
      
      // 直接跳转到 Creem 支付链接
      if (option.payment_link) {
        // 添加用户信息到 URL 参数
        const paymentUrl = new URL(option.payment_link);
        if (user.email) {
          paymentUrl.searchParams.set('customer_email', user.email);
        }
        if (user.id) {
          paymentUrl.searchParams.set('client_reference_id', user.id);
        }
        
        console.log('✅ Redirecting to Creem payment:', paymentUrl.toString());
        
        // 跳转到 Creem 支付页面
        window.location.href = paymentUrl.toString();
        return;
      }

      // 备用方案：通过后端 API 创建 checkout session
      const response = await fetch('/api/payment/creem-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: option.product_id,
          customer_email: user.email,
          metadata: {
            user_id: user.id,
            credits: option.credits.toString()
          }
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
      }

      const result = await response.json();
      
      if (!result.success || !result.checkout_url) {
        throw new Error('Invalid response from payment service');
      }

      console.log('✅ Checkout session created:', result);
      
      // 跳转到 Creem 提供的 checkout_url
      window.location.href = result.checkout_url;
      
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error instanceof Error ? error.message : 'Failed to initiate payment');
      setLoading(null);
    }
  };

  return (
    <>
      <Modal
        title={
          <div className="flex items-center space-x-2">
            <CrownOutlined className="text-yellow-500" />
            <span>Choose Your Plan</span>
          </div>
        }
        open={visible}
        onCancel={onClose}
        footer={null}
        width={600}
        className="credits-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {PURCHASE_OPTIONS.map((option) => (
            <Card
              key={option.id}
              className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
                option.popular ? 'border-2 border-blue-500 shadow-md' : ''
              }`}
              bodyStyle={{ padding: '20px' }}
            >
              {/* 推荐标签 */}
              {option.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                    ⭐ Recommended
                  </div>
                </div>
              )}

              <div className="text-center">
                {/* 价格 */}
                <div className="mb-3">
                  <Text className="text-3xl font-bold text-gray-800">
                    ${option.price}
                  </Text>
                  <div className="text-sm text-gray-500 mt-1">
                    {option.label}
                  </div>
                </div>

                {/* 积分数量 */}
                <div className="mb-4">
                  <div className="text-lg font-semibold text-blue-600">
                    💎 {option.credits === 15000 ? '15,000' : option.credits.toLocaleString()} credits
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </div>
                </div>

                {/* 支付按钮 */}
                <Button
                  type={option.popular ? 'primary' : 'default'}
                  size="large"
                  className="w-full"
                  loading={loading === option.id}
                  onClick={() => handlePayment(option)}
                  style={{
                    background: option.popular ? 'linear-gradient(135deg, #1890ff 0%, #722ed1 100%)' : undefined,
                    border: option.popular ? 'none' : undefined,
                  }}
                >
                  {option.price === 599 ? 'Upgrade to Ultimate' : 'Upgrade to Premium'}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* 说明文字 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 space-y-2">
            <div>• Secure payment processing via Creem</div>
            <div>• Credits are added instantly after payment</div>
            <div>• Contact support if you need assistance</div>
          </div>
        </div>
      </Modal>

      {/* 登录Modal */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          message.success('Login successful! You can now make a purchase.');
        }}
      />
    </>
  );
};

export default SimpleCreditsModal;
