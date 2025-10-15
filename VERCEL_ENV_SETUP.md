# Vercel 环境变量配置指南

## 🔒 安全最佳实践（必读！）

### ⚠️ 重要安全规则

**前缀的含义**：
- `VITE_` 或 `NEXT_PUBLIC_` 前缀：变量会**暴露在前端浏览器代码**中，任何访问网站的人都能看到
- **无前缀**：变量只在后端使用，对外不可见

**绝对不能暴露的敏感信息**：
- ❌ API 密钥（Secret Keys）
- ❌ Webhook Secrets
- ❌ 数据库 Service Role Keys
- ❌ 任何用于验证身份的私密令牌

**可以安全暴露的信息**：
- ✅ 公开 URL（如网站地址）
- ✅ 公开 API Keys（Publishable Keys，通常以 `pk_` 开头）
- ✅ 网站名称、主题配置等

### 🚨 Vercel 警告图标说明

如果你在 Vercel 环境变量设置中看到黄色 ⚠️ 图标，说明该变量会暴露到前端。
- 如果是敏感信息（API密钥、Secret等）：**立即移除 `VITE_` 或 `NEXT_PUBLIC_` 前缀**
- 如果是公开信息（URL、网站名称等）：可以安全使用

---

## 🔧 必须在 Vercel 设置的环境变量

访问：https://vercel.com/你的项目/settings/environment-variables

### 1️⃣ Creem 支付配置（必需 - 后端专用）

⚠️ **重要安全提示**：
- **不要**在变量名前加 `VITE_` 或 `NEXT_PUBLIC_` 前缀
- 这些是敏感信息，只应在后端使用
- 添加前缀会将密钥暴露到前端浏览器代码中！

```bash
# ✅ 正确：后端专用配置（无 VITE_ 前缀）
CREEM_API_KEY=creem_4yH5Q3DM2HuXRGaOJmpJiw
CREEM_WEBHOOK_SECRET=whsec_7Zer79qbRSW39bKcx4QPXf
```

### 2️⃣ 应用配置（必需 - 前端安全配置）

✅ **这些配置可以安全地暴露在前端**：

```bash
# 支付提供商选择
VITE_PAYMENT_PROVIDER=creem

# 应用 URL（用于支付回调和前端路由）
VITE_APP_URL=https://www.rednotewriter.com
NEXT_PUBLIC_APP_URL=https://www.rednotewriter.com

# 网站名称
VITE_SITE_NAME=文字转RedNote
```

### 3️⃣ Supabase 配置（必需 - 用于用户认证和积分管理）

```bash
# Supabase URL（可以暴露在前端）
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_URL=你的_supabase_url

# Supabase Anon Key（公开密钥 - 安全）
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的_anon_key
VITE_SUPABASE_ANON_KEY=你的_anon_key

# ⚠️ Supabase Service Role Key（服务端密钥 - 敏感！不要加 VITE_ 或 NEXT_PUBLIC_ 前缀）
SUPABASE_SERVICE_ROLE_KEY=你的_service_role_key
```

### 4️⃣ 豆包 API 配置（可选 - 用于图片生成）

```bash
# 豆包 API 密钥（如果是私钥，建议在后端使用）
VITE_DOUBAO_API_KEY=你的_doubao_api_key
```

---

## 📋 快速配置步骤

### 步骤 1：登录 Vercel
访问：https://vercel.com/dashboard

### 步骤 2：进入项目设置
1. 选择你的项目 `text-to-rednote`
2. 点击 **Settings** 标签
3. 点击 **Environment Variables**

### 步骤 3：添加环境变量
对于每个变量：
1. 点击 **Add New**
2. 填入 **Key**（变量名）
3. 填入 **Value**（变量值）
4. 选择环境：
   - ✅ Production
   - ✅ Preview
   - ✅ Development
5. 点击 **Save**

### 步骤 4：重新部署
添加完所有环境变量后：
1. 进入 **Deployments** 标签
2. 找到最新的部署
3. 点击 **...** 菜单
4. 选择 **Redeploy**
5. 勾选 **Use existing Build Cache**
6. 点击 **Redeploy**

---

## ⚠️ 重要提示

### 1. Webhook URL 配置
确保在 Creem 后台配置的 Webhook URL 为：
```
https://www.rednotewriter.com/api/payment/creem-webhook
```

### 2. Webhook 事件订阅
在 Creem Dashboard 中订阅以下事件：
- ✅ `checkout.session.completed`
- ✅ `payment_intent.succeeded`
- ✅ `payment_intent.payment_failed`

### 3. 产品 ID
确保 Creem 后台的产品 ID 与代码中配置一致：
- **$5 套餐**: `prod_6vVTmdcL0l4O0D28hZk25L`
- **$599 套餐**: `prod_5okTWJRCBjkApBlR7pEUnh`

### 4. 安全性
- ⚠️ **SUPABASE_SERVICE_ROLE_KEY** 是敏感密钥，切勿泄露！
- ⚠️ **CREEM_WEBHOOK_SECRET** 用于验证 webhook 签名，确保安全！
- ⚠️ 不要将这些密钥提交到 Git 仓库！

---

## 🧪 测试支付流程

配置完成后：

1. **访问网站**：https://www.rednotewriter.com
2. **注册/登录账户**
3. **点击购买按钮**
4. **选择套餐**：
   - $5 套餐 → "Upgrade to Premium"
   - $599 套餐 → "Upgrade to Ultimate"
5. **完成支付**：使用测试卡号（如果 Creem 提供测试模式）
6. **验证积分**：支付成功后，检查账户积分是否正确添加

---

## 🔍 调试

### 查看 Vercel 日志
1. 进入 Vercel Dashboard
2. 选择你的项目
3. 点击 **Deployments**
4. 选择一个部署
5. 点击 **Runtime Logs** 查看 API 日志

### 查看 Creem Webhook 日志
1. 登录 Creem Dashboard
2. 进入 **Webhooks** 或 **Events**
3. 查看 webhook 发送历史和响应状态

### 常见问题

**Q: 点击支付按钮没反应？**
- 检查浏览器控制台是否有错误
- 确认已登录账户
- 检查 `VITE_CREEM_API_KEY` 是否正确配置

**Q: 支付成功但积分没增加？**
- 检查 Vercel Runtime Logs 中的 webhook 处理日志
- 确认 `CREEM_WEBHOOK_SECRET` 配置正确
- 检查 Supabase 数据库连接和权限

**Q: 显示 404 错误？**
- 确认 Creem 产品 ID 在后台存在
- 检查产品 ID 拼写是否正确

---

## ✅ 配置检查清单

在测试前，确保以下所有项目都已完成：

- [ ] Vercel 中添加了所有必需的环境变量
- [ ] 环境变量应用于 Production、Preview 和 Development
- [ ] Creem Dashboard 中配置了 Webhook URL
- [ ] Creem Dashboard 中订阅了必需的 webhook 事件
- [ ] Creem 产品 ID 与代码中一致
- [ ] Supabase 数据库已设置（用户表、订单表、积分字段）
- [ ] 已重新部署 Vercel 项目
- [ ] 可以访问网站并成功登录

---

## 📞 需要帮助？

如果遇到问题：
1. 检查 Vercel Runtime Logs
2. 检查 Creem Dashboard 的 Webhook 日志
3. 检查浏览器开发者工具的控制台和网络请求
4. 联系技术支持

---

**最后更新**: 2025-10-15
**配置版本**: v1.0 - 使用新产品 ID

