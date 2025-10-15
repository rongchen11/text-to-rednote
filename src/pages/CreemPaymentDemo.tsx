import React, { useState } from 'react';
import { Card, Row, Col, Space, Typography, Button, message, Tag, Divider } from 'antd';
import { CreditCardOutlined, StarOutlined, CheckOutlined } from '@ant-design/icons';
import { CreemPaymentButton, UnifiedPaymentButton } from '../components/Payment';
import { getAllCreemProducts, formatPrice, formatCredits, getActualPrice, getSavingAmount } from '../config/creemProducts';
import { getPaymentConfigInfo } from '../config/paymentConfig';

const { Title, Text, Paragraph } = Typography;

const CreemPaymentDemo: React.FC = () => {
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const products = getAllCreemProducts();

  const handlePaymentStart = () => {
    message.info('正在创建支付会话...');
  };

  const handlePaymentSuccess = (result: any) => {
    setPaymentResult(result);
    message.success('支付会话创建成功！即将跳转到支付页面...');
  };

  const handlePaymentError = (error: string) => {
    message.error(`支付失败: ${error}`);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center' }}>
          <Title level={2}>
            <CreditCardOutlined /> Creem 支付系统演示
          </Title>
          <Paragraph type="secondary">
            展示 Creem 支付集成，支持一次性支付和订阅模式
          </Paragraph>
        </div>

        {/* 配置信息 */}
        <Card title="📊 支付配置信息" size="small">
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '12px', 
            borderRadius: '4px',
            fontSize: '12px',
            overflow: 'auto'
          }}>
            {getPaymentConfigInfo()}
          </pre>
        </Card>

        {/* 产品展示 */}
        <Title level={3}>💎 可用产品</Title>
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col xs={24} sm={12} lg={8} key={product.id}>
              <Card
                title={
                  <Space>
                    {product.name}
                    {product.popular && (
                      <Tag color="gold" icon={<StarOutlined />}>
                        热门
                      </Tag>
                    )}
                  </Space>
                }
                extra={
                  <Text strong style={{ fontSize: '18px', color: '#1890ff' }}>
                    {formatPrice(getActualPrice(product))}
                  </Text>
                }
                style={{
                  height: '100%',
                  border: product.popular ? '2px solid #1890ff' : '1px solid #d9d9d9'
                }}
                hoverable
              >
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {/* 产品描述 */}
                  <Text type="secondary">{product.description}</Text>
                  
                  {/* 积分信息 */}
                  <div>
                    <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>
                      {formatCredits(product.credits)}
                    </Text>
                  </div>

                  {/* 折扣信息 */}
                  {product.discount && (
                    <div>
                      <Text delete type="secondary">
                        {formatPrice(product.discount.originalAmount)}
                      </Text>
                      <Text type="success" style={{ marginLeft: '8px' }}>
                        节省 {formatPrice(getSavingAmount(product))}
                      </Text>
                    </div>
                  )}

                  {/* 产品特性 */}
                  <Space direction="vertical" size="small">
                    <Text>
                      <CheckOutlined style={{ color: '#52c41a' }} /> 一次性购买
                    </Text>
                    <Text>
                      <CheckOutlined style={{ color: '#52c41a' }} /> 积分永不过期
                    </Text>
                    <Text>
                      <CheckOutlined style={{ color: '#52c41a' }} /> 支持多种支付方式
                    </Text>
                  </Space>

                  <Divider style={{ margin: '12px 0' }} />

                  {/* 支付按钮 */}
                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    {/* Creem 支付按钮 */}
                    <CreemPaymentButton
                      productId={product.id}
                      onPaymentStart={handlePaymentStart}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      style={{ width: '100%' }}
                    />
                    
                    {/* 统一支付按钮（可选择提供商） */}
                    <UnifiedPaymentButton
                      productId={product.id}
                      forceProvider="creem"
                      onPaymentStart={handlePaymentStart}
                      onPaymentSuccess={handlePaymentSuccess}
                      onPaymentError={handlePaymentError}
                      type="default"
                      size="middle"
                    />
                  </Space>

                  {/* 产品ID */}
                  <Text type="secondary" style={{ fontSize: '11px' }}>
                    ID: {product.id}
                  </Text>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 支付结果 */}
        {paymentResult && (
          <Card title="🎉 支付会话结果" type="inner">
            <pre style={{ 
              backgroundColor: '#f6ffed', 
              padding: '12px', 
              borderRadius: '4px',
              fontSize: '12px',
              overflow: 'auto'
            }}>
              {JSON.stringify(paymentResult, null, 2)}
            </pre>
          </Card>
        )}

        {/* 使用说明 */}
        <Card title="📖 使用说明">
          <Space direction="vertical" size="middle">
            <div>
              <Title level={4}>配置步骤</Title>
              <ol>
                <li>获取 Creem API 密钥和 Webhook 密钥</li>
                <li>配置环境变量 <code>VITE_CREEM_API_KEY</code> 和 <code>VITE_CREEM_WEBHOOK_SECRET</code></li>
                <li>设置 <code>VITE_PAYMENT_PROVIDER=creem</code></li>
                <li>配置 Webhook 端点：<code>/api/payment/creem-webhook</code></li>
              </ol>
            </div>

            <div>
              <Title level={4}>测试流程</Title>
              <ol>
                <li>点击支付按钮创建支付会话</li>
                <li>系统会跳转到 Creem 托管的支付页面</li>
                <li>使用测试卡信息完成支付</li>
                <li>系统接收 Webhook 通知并处理积分</li>
              </ol>
            </div>

            <div>
              <Title level={4}>测试卡信息</Title>
              <ul>
                <li><strong>成功支付</strong>: 4242 4242 4242 4242</li>
                <li><strong>失败支付</strong>: 4000 0000 0000 0002</li>
                <li><strong>需要认证</strong>: 4000 0025 0000 3155</li>
              </ul>
            </div>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default CreemPaymentDemo;
