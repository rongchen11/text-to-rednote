# 💳 Creem 支付系统集成指南

## 🎯 概述

本项目已集成 Creem 支付系统，支持一次性支付和订阅模式。Creem 是一个现代化的支付解决方案，支持多种支付方式。

## 📦 已配置的产品

您已在 Creem 中创建了以下产品：

### 基础积分包
- **Product ID**: `prod_HkeKrlWaQEY0fdi1tndhR`
- **价格**: $5 USD
- **积分**: 100 积分
- **类型**: 一次性购买

### 专业积分包
- **Product ID**: `prod_5ttzeSFClCVV7Xchzc8rYu`
- **价格**: $599 USD
- **积分**: 15,000 积分
- **类型**: 一次性购买
- **标签**: 🔥 热门选择

## ⚙️ 配置步骤

### 1. 获取 Creem 配置信息

您需要从 Creem 仪表板获取以下信息：

1. **API 密钥**
   - 登录 [Creem 仪表板](https://creem.io/dashboard)
   - 导航到 **开发者** → **API 密钥**
   - 复制 API 密钥（测试模式: `ck_test_xxx`, 生产模式: `ck_live_xxx`）

2. **Webhook 密钥**
   - 在 Creem 仪表板中，导航到 **Webhooks**
   - 创建新的 Webhook，URL 设置为: `https://yourdomain.com/api/payment/creem-webhook`
   - 复制生成的 Webhook 密钥

### 2. 配置环境变量

创建或更新 `.env.local` 文件：

```env
# 设置默认支付提供商为 Creem
VITE_PAYMENT_PROVIDER=creem

# Creem 配置
VITE_CREEM_API_KEY=ck_test_your_api_key_here
VITE_CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# 服务端配置（用于 webhook 验证）
CREEM_API_KEY=ck_test_your_api_key_here
CREEM_WEBHOOK_SECRET=your_webhook_secret_here

# 应用配置
VITE_APP_URL=https://yourdomain.com
VITE_SITE_NAME=文字转RedNote
```

### 3. 配置 Webhook 端点

在 Creem 仪表板中配置 Webhook：

- **URL**: `https://yourdomain.com/api/payment/creem-webhook`
- **事件**: 选择以下事件
  - `checkout.session.completed` - 支付会话完成
  - `payment_intent.succeeded` - 支付成功
  - `payment_intent.payment_failed` - 支付失败

## 🔧 使用方法

### 基础用法

```tsx
import { CreemPaymentButton } from '../components/Payment';

// 基础积分包
<CreemPaymentButton
  productId="prod_HkeKrlWaQEY0fdi1tndhR"
  onPaymentSuccess={(result) => {
    console.log('支付成功:', result);
  }}
/>

// 专业积分包  
<CreemPaymentButton
  productId="prod_5ttzeSFClCVV7Xchzc8rYu"
  onPaymentSuccess={(result) => {
    console.log('支付成功:', result);
  }}
/>
```

### 统一支付组件

```tsx
import { UnifiedPaymentButton } from '../components/Payment';

// 自动选择支付提供商（根据配置）
<UnifiedPaymentButton
  productId="prod_HkeKrlWaQEY0fdi1tndhR"
  onPaymentSuccess={(result) => {
    console.log('支付成功:', result);
  }}
/>

// 强制使用 Creem
<UnifiedPaymentButton
  productId="prod_HkeKrlWaQEY0fdi1tndhR"
  forceProvider="creem"
  onPaymentSuccess={(result) => {
    console.log('支付成功:', result);
  }}
/>
```

## 🔄 支付流程

### 用户支付流程
1. 用户点击支付按钮
2. 系统创建 Creem 支付会话
3. 用户跳转到 Creem 托管的支付页面
4. 用户完成支付
5. Creem 发送 webhook 通知到您的服务器
6. 系统处理 webhook，给用户增加积分
7. 用户返回到成功页面

### 系统处理流程
1. **前端**: `CreemPaymentService.createCheckoutSession()`
2. **后端**: `/api/payment/creem-checkout` 创建支付会话
3. **跳转**: 用户跳转到 Creem 支付页面
4. **Webhook**: `/api/payment/creem-webhook` 处理支付结果
5. **数据库**: 更新订单状态和用户积分

## 🧪 测试

### 测试环境设置
1. 使用测试 API 密钥（`ck_test_xxx`）
2. 在 Creem 仪表板中启用测试模式
3. 使用 Creem 提供的测试卡信息进行测试

### 测试卡信息
- **成功支付**: `4242 4242 4242 4242`
- **失败支付**: `4000 0000 0000 0002`
- **需要认证**: `4000 0025 0000 3155`

## 🔍 调试

### 查看支付配置
```javascript
import { getPaymentConfigInfo } from '../config/paymentConfig';
console.log(getPaymentConfigInfo());
```

### 常见问题

1. **API 密钥错误**
   - 确保使用正确的 API 密钥格式
   - 测试环境使用 `ck_test_xxx`
   - 生产环境使用 `ck_live_xxx`

2. **Webhook 验证失败**
   - 确保 Webhook 密钥配置正确
   - 检查 Webhook URL 是否可访问
   - 查看服务器日志中的签名验证信息

3. **产品ID错误**
   - 确保使用正确的产品ID
   - 检查产品是否在 Creem 中激活

## 📊 监控

### 支付订单查询
```sql
-- 查看 Creem 支付订单
SELECT * FROM payment_orders 
WHERE payment_type = 'creem' 
ORDER BY created_at DESC;

-- 查看积分历史
SELECT * FROM credit_history 
WHERE reason LIKE '%Creem%' 
ORDER BY created_at DESC;
```

### 日志查看
- 前端: 浏览器控制台
- 后端: 服务器日志文件
- Webhook: `/api/payment/creem-webhook` 日志

## 🚀 部署

### 生产环境配置
1. 替换为生产环境 API 密钥
2. 设置正确的应用域名
3. 配置 HTTPS
4. 测试 Webhook 端点

### 安全建议
1. 妥善保管 API 密钥和 Webhook 密钥
2. 使用环境变量存储敏感信息
3. 定期轮换密钥
4. 监控异常支付活动

## 📞 支持

如果在集成过程中遇到问题：
1. 查看 Creem 官方文档
2. 检查系统日志
3. 联系 Creem 技术支持
4. 提交 GitHub Issue（如果是代码问题）

---

✅ **集成完成！**您现在可以使用 Creem 支付系统处理用户的积分购买了。
