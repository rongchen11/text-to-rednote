// Creem 支付会话创建API
import crypto from 'crypto';

// Creem API配置
const CREEM_API_KEY = process.env.CREEM_API_KEY;
const CREEM_API_BASE = 'https://api.creem.io/v1';

// 产品配置
const PRODUCTS = {
  'prod_HkeKrlWaQEY0fdi1tndhR': {
    id: 'prod_HkeKrlWaQEY0fdi1tndhR',
    name: '积分包 - 基础版',
    amount: 5,
    credits: 100,
    interval: 'one_time'
  },
  'prod_5ttzeSFClCVV7Xchzc8rYu': {
    id: 'prod_5ttzeSFClCVV7Xchzc8rYu', 
    name: '积分包 - 专业版',
    amount: 599,
    credits: 15000,
    interval: 'one_time'
  }
};

function generateOrderNo() {
  return 'CREEM_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

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
        message: 'Creem API 密钥未配置，请联系管理员' 
      });
      return;
    }

    const { product_id, success_url, cancel_url, customer_email, metadata } = req.body;

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

    // 生成订单号
    const outTradeNo = generateOrderNo();

    // 构建 Creem 支付会话数据
    const checkoutData = {
      mode: 'payment', // 一次性支付
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            description: `购买 ${product.credits} 积分`
          },
          unit_amount: product.amount * 100 // Creem 使用分为单位
        },
        quantity: 1
      }],
      success_url: success_url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.rednotewriter.com'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url || `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.rednotewriter.com'}`,
      customer_email: customer_email,
      metadata: {
        out_trade_no: outTradeNo,
        credits: product.credits.toString(),
        product_id: product_id,
        ...metadata
      }
    };

    console.log('📤 调用 Creem API 创建支付会话:', checkoutData);

    // 调用 Creem API 创建支付会话
    const creemResponse = await fetch(`${CREEM_API_BASE}/checkout/sessions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CREEM_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(checkoutData)
    });

    const creemResult = await creemResponse.json();

    if (!creemResponse.ok) {
      console.error('❌ Creem API 调用失败:', creemResult);
      res.status(400).json({ 
        success: false, 
        message: creemResult.error?.message || 'Creem API 调用失败' 
      });
      return;
    }

    console.log('✅ Creem 支付会话创建成功:', creemResult);

    // 创建数据库记录（可选，用于跟踪订单）
    try {
      // 这里可以添加数据库记录逻辑
      // 类似于 zpay-url.js 中的订单记录创建
      console.log('📝 订单记录:', {
        out_trade_no: outTradeNo,
        product_id: product_id,
        amount: product.amount,
        credits: product.credits,
        session_id: creemResult.id
      });
    } catch (dbError) {
      console.warn('⚠️ 数据库记录创建失败:', dbError);
      // 不影响支付流程，继续执行
    }

    // 返回成功响应
    res.status(200).json({
      success: true,
      checkout_url: creemResult.url,
      session_id: creemResult.id,
      out_trade_no: outTradeNo,
      debug_info: {
        product: product,
        checkout_data: checkoutData
      }
    });

  } catch (error) {
    console.error('❌ Creem 支付会话创建异常:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || '服务器内部错误' 
    });
  }
}
