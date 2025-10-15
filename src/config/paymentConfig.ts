// 支付配置文件
// 在这里配置您的Z-Pay商户信息

export interface PaymentConfig {
  // Z-Pay商户配置
  zpayPid: string;           // Z-Pay商户ID
  zpayKey: string;           // Z-Pay商户密钥
  
  // Creem 配置
  creemApiKey: string;       // Creem API 密钥
  creemWebhookSecret: string; // Creem Webhook 密钥
  
  // 应用配置
  appUrl: string;            // 应用域名
  siteName: string;          // 网站名称
  
  // 模式配置
  isDemoMode: boolean;       // 是否为演示模式
  enableDebugLog: boolean;   // 是否启用调试日志
  defaultPaymentProvider: 'zpay' | 'creem'; // 默认支付提供商
}

// 默认配置（真实支付模式）
export const defaultPaymentConfig: PaymentConfig = {
  // ✅ 真实Z-Pay商户信息
  zpayPid: '2025062920440492',       // 您的真实商户ID
  zpayKey: 'tNeFjVxC3b8IlgNJvqFA9oRNxy9ShaA1',       // 您的真实商户密钥
  
  // Creem 配置
  creemApiKey: 'creem_45FM6wm1YDgdhQ5hREjm6n',  // 您的 Creem API 密钥
  creemWebhookSecret: '',            // Webhook 密钥（从webhook配置中获取）
  
  // 应用配置
  appUrl: 'https://www.rednotewriter.com',
  siteName: '文字转RedNote',
  
  // 模式配置
  isDemoMode: false,         // ✅ 启用真实支付
  enableDebugLog: true,      // 开发时建议启用
  defaultPaymentProvider: 'creem' // 默认使用 Creem 支付
};

// 从环境变量获取配置（优先级更高）
// 在浏览器环境中使用 import.meta.env
export const paymentConfig: PaymentConfig = {
  zpayPid: import.meta.env.ZPAY_PID || defaultPaymentConfig.zpayPid,
  zpayKey: import.meta.env.ZPAY_KEY || defaultPaymentConfig.zpayKey,
  creemApiKey: import.meta.env.VITE_CREEM_API_KEY || defaultPaymentConfig.creemApiKey,
  creemWebhookSecret: import.meta.env.VITE_CREEM_WEBHOOK_SECRET || defaultPaymentConfig.creemWebhookSecret,
  appUrl: import.meta.env.VITE_APP_URL || defaultPaymentConfig.appUrl,
  siteName: import.meta.env.VITE_SITE_NAME || defaultPaymentConfig.siteName,
  // 优先使用默认配置，环境变量可以覆盖
  isDemoMode: import.meta.env.ZPAY_DEMO_MODE === 'true' ? true : defaultPaymentConfig.isDemoMode,
  enableDebugLog: import.meta.env.DEV === true,
  defaultPaymentProvider: (import.meta.env.VITE_PAYMENT_PROVIDER as 'zpay' | 'creem') || defaultPaymentConfig.defaultPaymentProvider
};

// 配置验证
export function validatePaymentConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!paymentConfig.isDemoMode) {
    // 根据默认支付提供商验证相应配置
    if (paymentConfig.defaultPaymentProvider === 'zpay') {
      // Z-Pay 配置验证
      if (!paymentConfig.zpayPid || paymentConfig.zpayPid === 'demo_pid') {
        errors.push('请配置真实的Z-Pay商户ID (ZPAY_PID)');
      }
      
      if (!paymentConfig.zpayKey || paymentConfig.zpayKey === 'demo_key') {
        errors.push('请配置真实的Z-Pay商户密钥 (ZPAY_KEY)');
      }
    } else if (paymentConfig.defaultPaymentProvider === 'creem') {
      // Creem 配置验证
      if (!paymentConfig.creemApiKey) {
        errors.push('请配置 Creem API 密钥 (VITE_CREEM_API_KEY)');
      }
      
      if (!paymentConfig.creemWebhookSecret) {
        errors.push('请配置 Creem Webhook 密钥 (VITE_CREEM_WEBHOOK_SECRET)');
      }
      
      if (paymentConfig.creemApiKey && !paymentConfig.creemApiKey.startsWith('creem_') && !paymentConfig.creemApiKey.startsWith('ck_')) {
        errors.push('Creem API 密钥格式错误，应以 creem_ 、ck_test_ 或 ck_live_ 开头');
      }
    }
    
    if (!paymentConfig.appUrl.startsWith('https://') && !paymentConfig.appUrl.includes('localhost')) {
      errors.push('生产环境请使用HTTPS域名');
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
` : `
Creem 配置:
API 密钥: ${paymentConfig.creemApiKey ? (paymentConfig.creemApiKey.substring(0, 12) + '...') : '❌ 未配置'}
Webhook 密钥: ${paymentConfig.creemWebhookSecret ? '✅ 已配置' : '❌ 未配置'}
`}

${paymentConfig.isDemoMode ? `
⚠️  当前为演示模式，不会进行真实支付
💡 要启用真实支付，请：
1. 配置 ${provider === 'zpay' ? 'Z-Pay' : 'Creem'} 相关密钥
2. 在 src/config/paymentConfig.ts 中更新配置
3. 或设置相应的环境变量
4. 设置 isDemoMode = false
` : `
✅ 真实支付模式已启用
${validation.valid ? '✅ 配置验证通过' : '❌ 配置验证失败:\n' + validation.errors.join('\n')}
`}
=================
  `.trim();
}
