// Creem 支付会话创建API
// 根据官方文档: https://docs.creem.io/api-reference/endpoint/create-checkout

// Creem API配置
const CREEM_API_KEY = process.env.CREEM_API_KEY || 'creem_45FM6wm1YDgdhQ5hREjm6n';
const CREEM_API_URL = 'https://api.creem.io/v1/checkouts';

// 产品配置
const PRODUCTS = {
  'prod_6vVTmdcL0l4O0D28hZk25L': {
    id: 'prod_6vVTmdcL0l4O0D28hZk25L',
    name: 'Standard Plan',
    amount: 5,
    credits: 100,
    interval: 'one_time'
  },
  'prod_5okTWJRCBjkApBlR7pEUnh': {
    id: 'prod_5okTWJRCBjkApBlR7pEUnh', 
    name: 'Unlimited Plan',
    amount: 599,
    credits: 15000,
    interval: 'one_time'
  }
};

export default async function handler(req, res) {
  // 启用 CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }

  try {
    console.log('🚀 Creem 支付会话创建请求:', req.body);

    // 检查API密钥
    if (!CREEM_API_KEY) {
      console.error('❌ Creem API 密钥未配置');
      res.status(500).json({ 
        success: false, 
        message: 'Creem API 密钥未配置' 
      });
      return;
    }

    const { product_id, customer_email, metadata } = req.body;

    // 验证必需参数
    if (!product_id) {
      res.status(400).json({ 
        success: false, 
        message: '缺少产品ID' 
      });
      return;
    }

    // 验证产品是否存在
    const product = PRODUCTS[product_id];
    if (!product) {
      res.status(400).json({ 
        success: false, 
        message: `无效的产品ID: ${product_id}` 
      });
      return;
    }

    // 构建 Creem API 请求 - 根据官方文档
    const checkoutData = {
      product_id: product_id,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.rednotewriter.com'}/payment/success`,
      metadata: {
        credits: product.credits.toString(),
        product_name: product.name,
        user_email: customer_email,
        ...metadata
      }
    };

    console.log('📤 调用 Creem API 创建支付会话:', checkoutData);

    // 调用 Creem API - 使用正确的认证方式
    const creemResponse = await fetch(CREEM_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CREEM_API_KEY  // 使用 x-api-key 而不是 Authorization
      },
      body: JSON.stringify(checkoutData)
    });

    if (!creemResponse.ok) {
      const errorText = await creemResponse.text();
      console.error('❌ Creem API 调用失败:', {
        status: creemResponse.status,
        statusText: creemResponse.statusText,
        error: errorText
      });
      res.status(400).json({ 
        success: false, 
        message: `Creem API 错误 (${creemResponse.status}): ${errorText}` 
      });
      return;
    }

    const creemResult = await creemResponse.json();
    console.log('✅ Creem 支付会话创建成功:', creemResult);

    // 返回成功响应，包含 checkout_url
    res.status(200).json({
      success: true,
      checkout_url: creemResult.checkout_url,  // Creem 返回的支付页面 URL
      session_id: creemResult.id,
      product: product
    });

  } catch (error) {
    console.error('❌ Creem 支付会话创建异常:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '服务器内部错误' 
    });
  }
}
