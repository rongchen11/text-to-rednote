import React, { useState } from 'react';
import { Modal, Card, Typography, message, Button } from 'antd';
import { CrownOutlined, WalletOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { PaymentButton } from '../Payment';
import { LoginModal } from '../Auth/LoginModal';

const { Title, Text, Paragraph } = Typography;

interface CreditsModalProps {
  visible: boolean;
  onClose: () => void;
}

// 海外市场购买选项配置
const PURCHASE_OPTIONS = [
  {
    id: 'free_trial',
    price: 0,
    credits: 100,
    label: 'Free Trial',
    popular: false,
    description: 'Perfect for getting started',
    isFree: true,
    product_id: 'free_trial_100', // Creem product_id
  },
  {
    id: 'standard_pack',
    price: 5,
    credits: 500,
    label: 'Standard',
    popular: true,
    description: 'Great value for regular users',
    bonus: 50, // 额外赠送
    product_id: 'standard_550_credits', // Creem product_id
  },
  {
    id: 'unlimited_pack',
    price: 599,
    credits: -1, // -1 表示无限积分
    label: 'Unlimited',
    popular: false,
    description: 'One-time purchase, unlimited access',
    isUnlimited: true,
    product_id: 'unlimited_subscription', // Creem product_id
  },
];

export const CreditsModal: React.FC<CreditsModalProps> = ({
  visible,
  onClose,
}) => {
  const { user, isAuthenticated, addCredits, setUser } = useAuthStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 支付相关处理
  const handlePaymentStart = () => {
    setLoading('payment');
    message.info('Redirecting to payment page...');
  };

  const handlePaymentSuccess = (orderInfo: any) => {
    console.log('支付成功:', orderInfo);
    message.success('Payment link generated successfully, redirecting to payment page');
    setLoading(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('支付错误:', error);
    message.error(`支付失败: ${error}`);
    setLoading(null);
  };

  // 处理免费套餐的逻辑
  const handleFreePackage = async () => {
    // 如果用户未登录，显示登录Modal
    if (!isAuthenticated || !user) {
      setShowLoginModal(true);
      return;
    }

    // 如果用户已经获得过免费积分，不能再次获得
    if (user.hasReceivedFreeCredits) {
      message.info('You have already received your free credits!');
      return;
    }

    try {
      setLoading('free');
      message.info('Processing free credits...');
      
      // 给用户添加100积分
      const success = await addCredits(100);
      
      if (success) {
        // 更新用户状态，标记已获得免费积分
        if (user) {
          setUser({ 
            ...user, 
            credits: user.credits + 100,
            hasReceivedFreeCredits: true 
          });
        }
        message.success('Congratulations! 100 free credits added to your account!');
        onClose(); // 关闭模态框
      } else {
        message.error('Failed to add free credits. Please try again.');
      }
      
      setLoading(null);
    } catch (error) {
      console.error('Free package error:', error);
      message.error('Failed to add free credits. Please try again.');
      setLoading(null);
    }
  };

  const renderPurchaseCard = (option: typeof PURCHASE_OPTIONS[0]) => {
    const totalCredits = option.isUnlimited ? -1 : option.credits + (option.bonus || 0);
    
    return (
      <Card
        key={option.id}
        className={`relative transition-all duration-200 hover:shadow-lg cursor-pointer ${
          option.popular ? 'border-2 border-blue-500 shadow-md' : ''
        } ${option.isFree ? 'border-2 border-green-500' : ''} ${option.isUnlimited ? 'border-2 border-purple-500' : ''}`}
        bodyStyle={{ padding: '20px' }}
      >
        {/* 标签 */}
        {option.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              <CrownOutlined className="mr-1" />
              Recommended
            </div>
          </div>
        )}
        {option.isFree && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              ✨ Free
            </div>
          </div>
        )}
        {option.isUnlimited && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              🚀 Unlimited
            </div>
          </div>
        )}

        <div className="text-center">
          {/* 价格 */}
          <div className="mb-3">
            <Text className="text-2xl font-bold text-gray-800">
              {option.isFree ? 'Free' : `$${option.price}`}
            </Text>
            <div className="text-xs text-gray-500 mt-1">
              {option.label}
            </div>
          </div>

          {/* 积分数量 */}
          <div className="mb-4">
            <div className="text-lg font-semibold text-blue-600">
              💎 {option.isUnlimited ? '∞ Unlimited Credits' : `${option.credits.toLocaleString()} credits`}
            </div>
            {option.bonus && !option.isUnlimited && (
              <div className="text-sm text-green-600 mt-1">
                + Bonus {option.bonus} credits
              </div>
            )}
            {!option.isUnlimited && (
              <div className="text-xs text-gray-500 mt-1">
                Total: {totalCredits.toLocaleString()} credits
              </div>
            )}
            {option.isUnlimited && (
              <div className="text-xs text-gray-500 mt-1">
                Generate unlimited images
              </div>
            )}
          </div>

          {/* 描述 */}
          <div className="mb-4">
            <Text className="text-sm text-gray-600">
              {option.description}
            </Text>
          </div>

          {/* 支付/获取按钮 */}
          {option.isFree ? (
            <Button
              type="primary"
              size="large"
              className={`w-full ${
                isAuthenticated && user?.hasReceivedFreeCredits 
                  ? 'bg-gray-400 hover:bg-gray-400 border-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 border-green-600'
              }`}
              onClick={() => handleFreePackage()}
              loading={loading === 'free'}
              disabled={!!loading || (isAuthenticated && user?.hasReceivedFreeCredits)}
            >
              {isAuthenticated && user?.hasReceivedFreeCredits 
                ? '✅ Already Received' 
                : 'Get Free Credits'
              }
            </Button>
          ) : (
            <PaymentButton
              productName={option.label}
              amount={option.price}
              credits={totalCredits}
              paymentType="card" // 海外默认信用卡支付
              type={option.popular ? 'primary' : 'default'}
              size="large"
              className="w-full"
              disabled={!!loading}
              onPaymentStart={handlePaymentStart}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          )}
        </div>
      </Card>
    );
  };

  return (
    <>
    <Modal
      title={
        <div className="flex items-center">
          <WalletOutlined className="mr-2 text-blue-500" />
          <span>Credits & Pricing</span>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={900}
      className="credits-modal"
    >
      <div className="space-y-6">
        {/* 当前积分状态 */}
        {isAuthenticated && user ? (
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <Title level={4} className="mb-2">
                  Your Account
                </Title>
                <div className="flex items-center space-x-4">
                  <div>
                    <Text className="text-gray-600">Username: </Text>
                    <Text className="font-medium">{user.username}</Text>
                  </div>
                  <div>
                    <Text className="text-gray-600">Current Credits: </Text>
                    <Text className="text-lg font-bold text-blue-600">
                      💎 {user.credits?.toLocaleString()} credits
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="bg-yellow-50 border-yellow-200">
            <Paragraph className="mb-0 text-center">
              <Text className="text-yellow-800">
                Please log in to purchase credits
              </Text>
            </Paragraph>
          </Card>
        )}

        {/* 充值说明 */}
        <Card>
          <Title level={4} className="mb-3">
            💰 Pricing Plans
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">Free Trial</div>
              <div className="text-sm text-gray-600">100 credits to get started</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">Pay as You Go</div>
              <div className="text-sm text-gray-600">$5 for 550 credits + bonus</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">Unlimited Access</div>
              <div className="text-sm text-gray-600">One-time payment for unlimited use</div>
            </div>
          </div>
        </Card>


        {/* 购买选项 */}
        <div>
          <Title level={4} className="mb-4">
            🎁 Choose Your Plan
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PURCHASE_OPTIONS.map(option => renderPurchaseCard(option))}
          </div>
        </div>

        {/* 使用说明 */}
        <Card className="bg-blue-50 border-blue-200">
          <Title level={5} className="mb-3">
            📝 How It Works
          </Title>
          <ul className="space-y-1 text-sm text-gray-700">
            <li>• Generate 1 image = 20 credits</li>
            <li>• AI text splitting is free to use</li>
            <li>• Credits never expire</li>
            <li>• Track your usage anytime</li>
            <li>• Unlimited plans have no credit restrictions</li>
          </ul>
        </Card>

        {/* 支付提示 */}
        <div className="text-center text-gray-500 text-xs">
          <div>
            * Secure payment processing via Creem
          </div>
          <div>
            * Credits are added instantly after payment
          </div>
          <div>
            * Contact support if you need assistance
          </div>
        </div>
      </div>
    </Modal>

    {/* 登录Modal */}
    <LoginModal
      visible={showLoginModal}
      onClose={() => setShowLoginModal(false)}
    />
  </>
  );
};
