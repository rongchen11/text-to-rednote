import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useAuthStore } from '../../stores/useAuthStore';
import { CreemPaymentService } from '../../services/creemPaymentService';
import { paymentConfig } from '../../config/paymentConfig';

export interface CreemPaymentButtonProps {
  productId: string;
  className?: string;
  size?: 'small' | 'middle' | 'large';
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
  disabled?: boolean;
  style?: React.CSSProperties;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
}

export const CreemPaymentButton: React.FC<CreemPaymentButtonProps> = ({
  productId,
  className,
  size = 'large',
  type = 'primary',
  disabled = false,
  style,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const { isAuthenticated, user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  // 获取产品信息
  const product = CreemPaymentService.getProduct(productId);

  if (!product) {
    return (
      <Button disabled className={className} size={size}>
        产品未找到
      </Button>
    );
  }

  const handlePayment = async () => {
    try {
      // 检查用户登录状态
      if (!isAuthenticated || !user) {
        message.error('Please log in to make a payment');
        return;
      }

      // 检查 Creem 配置
      const apiKey = paymentConfig.creemApiKey || 'creem_45FM6wm1YDgdhQ5hREjm6n';
      if (!apiKey) {
        message.error('Creem 支付尚未配置，请联系管理员');
        return;
      }

      setLoading(true);
      onPaymentStart?.();

      console.log('🚀 开始创建 Creem 支付会话:', product);

      // 创建支付会话
      const result = await CreemPaymentService.createCheckoutSession({
        product_id: productId,
        customer_email: user.email,
        success_url: `${paymentConfig.appUrl}/payment/success`,
        cancel_url: paymentConfig.appUrl,
        metadata: {
          user_id: user.id,
          credits: product.credits.toString()
        }
      });

      if (!result.success || !result.checkout_url) {
        throw new Error(result.error || 'Failed to create payment session');
      }

      console.log('✅ Creem 支付会话创建成功:', result);

      // 触发成功回调
      onPaymentSuccess?.(result);

      // 跳转到 Creem 支付页面
      console.log('🚀 跳转到 Creem 支付页面');
      CreemPaymentService.redirectToCheckout(result.checkout_url);

    } catch (error) {
      console.error('❌ Creem 支付处理错误:', error);
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      message.error(errorMessage);
      onPaymentError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (amount: number) => {
    return CreemPaymentService.formatPrice(amount);
  };

  return (
    <Button
      type={type}
      size={size}
      loading={loading}
      disabled={disabled}
      onClick={handlePayment}
      className={className}
      style={{
        background: type === 'primary' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
        border: type === 'primary' ? 'none' : undefined,
        boxShadow: type === 'primary' ? '0 4px 15px 0 rgba(116, 75, 162, 0.3)' : undefined,
        ...style,
      }}
    >
      {loading ? (
        'Processing...'
      ) : (
        <>
          💳 Pay {formatPrice(product.amount)} - Get {product.credits} Credits
        </>
      )}
    </Button>
  );
};

export default CreemPaymentButton;
