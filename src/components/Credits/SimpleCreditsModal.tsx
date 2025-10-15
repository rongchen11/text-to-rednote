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

// 简化的购买选项
const PURCHASE_OPTIONS = [
  {
    id: 'basic',
    price: 5,
    credits: 100,
    label: 'Basic Plan',
    description: 'Great for getting started',
    product_id: 'prod_HkeKrlWaQEY0fdi1tndhR',
    popular: true
  },
  {
    id: 'unlimited', 
    price: 599,
    credits: 15000,
    label: 'Unlimited Plan',
    description: 'One-time purchase, unlimited access',
    product_id: 'prod_5ttzeSFClCVV7Xchzc8rYu',
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
      
      // 直接跳转到 Creem 支付页面
      const baseUrl = 'https://creem.io/checkout';
      const params = new URLSearchParams({
        product_id: option.product_id,
        customer_email: user.email || '',
        success_url: `${window.location.origin}/payment/success`,
        cancel_url: window.location.origin
      });
      
      const checkoutUrl = `${baseUrl}?${params.toString()}`;
      
      message.info('Redirecting to payment page...');
      
      // 在新窗口打开支付页面
      window.open(checkoutUrl, '_blank');
      
    } catch (error) {
      console.error('Payment error:', error);
      message.error('Failed to open payment page');
    } finally {
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
                  {option.price === 599 ? 'Upgrade to Premium' : `Pay $${option.price} - Get ${option.credits} Credits`}
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
