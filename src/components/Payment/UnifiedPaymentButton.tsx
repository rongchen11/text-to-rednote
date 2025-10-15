import React from 'react';
import { paymentConfig } from '../../config/paymentConfig';
import { PaymentButton } from './PaymentButton';
import CreemPaymentButton from './CreemPaymentButton';
import { Button, Space, Tag } from 'antd';

interface UnifiedPaymentButtonProps {
  // Z-Pay 相关属性
  productName?: string;
  amount?: number;
  credits?: number;
  paymentType?: 'wxpay' | 'alipay' | 'card';
  
  // Creem 相关属性  
  productId?: string;
  
  // 通用属性
  className?: string;
  size?: 'small' | 'middle' | 'large';
  type?: 'default' | 'primary' | 'dashed' | 'link' | 'text';
  disabled?: boolean;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (result: any) => void;
  onPaymentError?: (error: string) => void;
  
  // 强制指定支付提供商
  forceProvider?: 'zpay' | 'creem';
}

export const UnifiedPaymentButton: React.FC<UnifiedPaymentButtonProps> = ({
  productName,
  amount,
  credits,
  paymentType = 'wxpay',
  productId,
  className,
  size = 'large',
  type = 'primary',
  disabled = false,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  forceProvider
}) => {
  // 确定使用的支付提供商
  const provider = forceProvider || paymentConfig.defaultPaymentProvider;

  // 根据提供商渲染相应的支付按钮
  if (provider === 'creem') {
    if (!productId) {
      return (
        <Button disabled className={className} size={size}>
          缺少 Creem 产品ID
        </Button>
      );
    }
    
    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <CreemPaymentButton
          productId={productId}
          className={className}
          size={size}
          type={type}
          disabled={disabled}
          onPaymentStart={onPaymentStart}
          onPaymentSuccess={onPaymentSuccess}  
          onPaymentError={onPaymentError}
        />
        <Tag color="blue" style={{ alignSelf: 'center' }}>
          💳 Creem 支付
        </Tag>
      </Space>
    );
  } else {
    if (!productName || !amount || !credits) {
      return (
        <Button disabled className={className} size={size}>
          缺少 Z-Pay 支付参数
        </Button>
      );
    }
    
    return (
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <PaymentButton
          productName={productName}
          amount={amount}
          credits={credits}
          paymentType={paymentType}
          className={className}
          size={size}
          type={type}
          disabled={disabled}
          onPaymentStart={onPaymentStart}
          onPaymentSuccess={onPaymentSuccess}
          onPaymentError={onPaymentError}
        />
        <Tag color="green" style={{ alignSelf: 'center' }}>
          🏦 Z-Pay 支付
        </Tag>
      </Space>
    );
  }
};

export default UnifiedPaymentButton;
