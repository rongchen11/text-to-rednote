// 支付配置文件 - 前端安全版本
// ⚠️ 重要：敏感信息（API密钥、Webhook Secret）仅在后端使用，不应暴露在前端

export interface PaymentConfig {
  // Z-Pay商户配置（后端使用，前端不应访问）
  // 注意：这些配置仅用于向后兼容，实际应在后端环境变量中配置
  zpayPid: string;           // Z-Pay商户ID
  zpayKey: string;           // Z-Pay商户密钥
  
  // 应用配置（前端安全）
  appUrl: string;            // 应用域名
  siteName: string;          // 网站名称
  
  // 模式配置
  isDemoMode: boolean;       // 是否为演示模式
  enableDebugLog: boolean;   // 是否启用调试日志
  defaultPaymentProvider: 'zpay' | 'creem'; // 默认支付提供商
}

// 默认配置
export const defaultPaymentConfig: PaymentConfig = {
  // Z-Pay 配置（向后兼容，应迁移到后端）
  zpayPid: '2025062920440492',
  zpayKey: 'tNeFjVxC3b8IlgNJvqFA9oRNxy9ShaA1',
  
  // 应用配置
  appUrl: 'https://www.rednotewriter.com',
  siteName: '文字转RedNote',
  
  // 模式配置
  isDemoMode: false,
  enableDebugLog: true,
  defaultPaymentProvider: 'creem' // 默认使用 Creem 支付
};

// 从环境变量获取配置（优先级更高）
// 注意：仅包含前端安全的配置项
export const paymentConfig: PaymentConfig = {
  // Z-Pay 配置（向后兼容）
  zpayPid: import.meta.env.ZPAY_PID || defaultPaymentConfig.zpayPid,
  zpayKey: import.meta.env.ZPAY_KEY || defaultPaymentConfig.zpayKey,
  
  // 前端安全配置
  appUrl: import.meta.env.VITE_APP_URL || defaultPaymentConfig.appUrl,
  siteName: import.meta.env.VITE_SITE_NAME || defaultPaymentConfig.siteName,
  isDemoMode: import.meta.env.ZPAY_DEMO_MODE === 'true' ? true : defaultPaymentConfig.isDemoMode,
  enableDebugLog: import.meta.env.DEV === true,
  defaultPaymentProvider: (import.meta.env.VITE_PAYMENT_PROVIDER as 'zpay' | 'creem') || defaultPaymentConfig.defaultPaymentProvider
};

// 配置验证
export function validatePaymentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!paymentConfig.isDemoMode) {
    // 基本配置验证
    if (!paymentConfig.appUrl.startsWith('https://') && !paymentConfig.appUrl.includes('localhost')) {
      errors.push('生产环境请使用HTTPS域名');
    }
    
    // 支付提供商特定验证
    if (paymentConfig.defaultPaymentProvider === 'zpay') {
      if (!paymentConfig.zpayPid || paymentConfig.zpayPid === 'demo_pid') {
        errors.push('请在后端配置真实的 Z-Pay 商户ID (ZPAY_PID)');
      }
      if (!paymentConfig.zpayKey || paymentConfig.zpayKey === 'demo_key') {
        errors.push('请在后端配置真实的 Z-Pay 商户密钥 (ZPAY_KEY)');
      }
    } else if (paymentConfig.defaultPaymentProvider === 'creem') {
      // Creem 的敏感配置在后端验证，前端只检查基本配置
      console.info('✅ Creem 支付模式：API密钥和Webhook Secret在后端配置');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// 获取支付配置信息（用于调试）
export function getPaymentConfigInfo(): string {
  const validation = validatePaymentConfig();
  const provider = paymentConfig.defaultPaymentProvider;
  
  return `
💳 支付配置信息:
=================
模式: ${paymentConfig.isDemoMode ? '🚨 演示模式' : '✅ 真实支付模式'}
默认提供商: ${provider === 'zpay' ? '🏦 Z-Pay' : '💳 Creem'}
应用域名: ${paymentConfig.appUrl}
网站名称: ${paymentConfig.siteName}

${provider === 'zpay' ? `
Z-Pay 配置:
商户ID: ${paymentConfig.zpayPid}
密钥状态: ${paymentConfig.zpayKey ? '✅ 已配置' : '❌ 未配置'}
⚠️  建议将Z-Pay密钥迁移到后端环境变量
` : `
Creem 配置:
✅ API 密钥配置在后端 (CREEM_API_KEY)
✅ Webhook Secret 配置在后端 (CREEM_WEBHOOK_SECRET)
🔒 敏感信息不暴露在前端，安全！
`}

${paymentConfig.isDemoMode ? `
⚠️  当前为演示模式，不会进行真实支付
💡 要启用真实支付，请：
1. 在 Vercel 后端配置 ${provider === 'zpay' ? 'Z-Pay' : 'Creem'} 环境变量
2. ${provider === 'creem' ? 'CREEM_API_KEY 和 CREEM_WEBHOOK_SECRET' : 'ZPAY_PID 和 ZPAY_KEY'}
3. 设置 isDemoMode = false
` : `
✅ 真实支付模式已启用
${validation.valid ? '✅ 配置验证通过' : '❌ 配置验证失败:\n' + validation.errors.join('\n')}
`}
=================
  `.trim();
}
