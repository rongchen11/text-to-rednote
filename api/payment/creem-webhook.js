// Creem Webhook 处理接口
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// 从环境变量获取配置
const CREEM_WEBHOOK_SECRET = process.env.CREEM_WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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

/**
 * 验证 Creem Webhook 签名
 */
function verifyWebhookSignature(payload, signature, secret) {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(payload, 'utf8')
      .digest('hex');
    
    // Creem 签名格式通常是 "sha256=<hash>"
    const receivedSignature = signature.replace('sha256=', '');
    
    return crypto.timingSafeEqual(
      Buffer.from(expectedSignature, 'hex'),
      Buffer.from(receivedSignature, 'hex')
    );
  } catch (error) {
    console.error('签名验证失败:', error);
    return false;
  }
}

/**
 * 处理支付成功事件
 */
async function handlePaymentSuccess(session) {
  try {
    console.log('🎉 处理支付成功事件:', session);

    const { id: session_id, metadata, customer_email, amount_total } = session;
    
    if (!metadata) {
      throw new Error('缺少 metadata 信息');
    }

    const { out_trade_no, product_id, credits, user_token } = metadata;

    if (!out_trade_no || !product_id || !credits) {
      throw new Error('缺少必要的 metadata 字段');
    }

    // 验证产品信息
    const product = PRODUCTS[product_id];
    if (!product) {
      throw new Error(`无效的产品ID: ${product_id}`);
    }

    // 获取用户信息
    let userId = null;
    if (user_token) {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser(user_token);
        if (!authError && user) {
          userId = user.id;
        }
      } catch (error) {
        console.warn('获取用户信息失败:', error);
      }
    }

    // 如果没有用户ID，尝试通过邮箱查找用户
    if (!userId && customer_email) {
      const { data: userProfile, error: profileError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('email', customer_email)
        .single();
      
      if (!profileError && userProfile) {
        userId = userProfile.id;
      }
    }

    if (!userId) {
      throw new Error('无法确定用户身份');
    }

    // 检查订单是否已经处理过
    const { data: existingOrder, error: checkError } = await supabase
      .from('payment_orders')
      .select('*')
      .eq('out_trade_no', out_trade_no)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw new Error('查询订单失败: ' + checkError.message);
    }

    if (existingOrder) {
      if (existingOrder.status === 'paid') {
        console.log('订单已经处理过，跳过:', out_trade_no);
        return { success: true, message: 'Order already processed' };
      }
    } else {
      // 创建新订单记录
      const { error: insertError } = await supabase
        .from('payment_orders')
        .insert({
          out_trade_no,
          user_id: userId,
          product_name: product.name,
          amount: product.amount,
          credits: parseInt(credits),
          payment_type: 'creem',
          status: 'paid',
          creem_session_id: session_id,
          paid_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        });

      if (insertError) {
        throw new Error('创建订单记录失败: ' + insertError.message);
      }
    }

    // 更新订单状态为已支付（如果是现有订单）
    if (existingOrder && existingOrder.status !== 'paid') {
      const { error: updateError } = await supabase
        .from('payment_orders')
        .update({
          status: 'paid',
          creem_session_id: session_id,
          paid_at: new Date().toISOString()
        })
        .eq('out_trade_no', out_trade_no);

      if (updateError) {
        throw new Error('更新订单状态失败: ' + updateError.message);
      }
    }

    // 给用户增加积分
    // 先获取当前积分
    const { data: currentProfile, error: getProfileError } = await supabase
      .from('user_profiles')
      .select('credits')
      .eq('id', userId)
      .single();

    if (getProfileError) {
      throw new Error('获取用户当前积分失败: ' + getProfileError.message);
    }

    // 计算新积分并更新
    const creditsToAdd = parseInt(credits);
    const newCredits = currentProfile.credits + creditsToAdd;
    
    const { error: creditError } = await supabase
      .from('user_profiles')
      .update({
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (creditError) {
      throw new Error('增加用户积分失败: ' + creditError.message);
    }

    // 记录积分历史
    const { error: historyError } = await supabase
      .from('credit_history')
      .insert({
        user_id: userId,
        amount: creditsToAdd,
        reason: `购买积分: ${product.name}`,
        created_at: new Date().toISOString()
      });

    if (historyError) {
      console.error('记录积分历史失败:', historyError);
      // 不影响主流程，继续执行
    }

    console.log('✅ 支付处理完成:', {
      out_trade_no,
      user_id: userId,
      credits_added: creditsToAdd,
      new_total: newCredits
    });

    return { 
      success: true, 
      message: 'Payment processed successfully',
      data: {
        out_trade_no,
        credits_added: creditsToAdd,
        new_total: newCredits
      }
    };

  } catch (error) {
    console.error('❌ 处理支付成功事件失败:', error);
    throw error;
  }
}

/**
 * 主处理函数
 */
export default async function handler(req, res) {
  // 启用 CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, X-Creem-Signature');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('🔔 收到 Creem Webhook 通知');

    // 检查配置
    if (!CREEM_WEBHOOK_SECRET) {
      console.error('❌ Creem Webhook 密钥未配置');
      res.status(500).json({ error: 'Webhook secret not configured' });
      return;
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
      console.error('❌ Supabase 配置缺失');
      res.status(500).json({ error: 'Database configuration missing' });
      return;
    }

    // 获取原始请求体
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-creem-signature'] || req.headers['creem-signature'];

    if (!signature) {
      console.error('❌ 缺少签名头');
      res.status(400).json({ error: 'Missing signature header' });
      return;
    }

    // 验证签名
    const isValidSignature = verifyWebhookSignature(rawBody, signature, CREEM_WEBHOOK_SECRET);
    
    if (!isValidSignature) {
      console.error('❌ 签名验证失败');
      res.status(401).json({ error: 'Invalid signature' });
      return;
    }

    console.log('✅ 签名验证通过');

    // 解析事件
    const event = req.body;
    console.log('📥 接收到事件:', event.type);

    let result;

    switch (event.type) {
      case 'checkout.session.completed':
        // 支付会话完成
        result = await handlePaymentSuccess(event.data.object);
        break;

      case 'payment_intent.succeeded':
        // 支付成功
        console.log('💰 支付成功事件:', event.data.object);
        result = { success: true, message: 'Payment succeeded' };
        break;

      case 'payment_intent.payment_failed':
        // 支付失败
        console.log('💸 支付失败事件:', event.data.object);
        result = { success: true, message: 'Payment failed' };
        break;

      default:
        console.log('⚠️ 未处理的事件类型:', event.type);
        result = { success: true, message: 'Event type not handled' };
        break;
    }

    console.log('✅ Webhook 处理完成:', result);
    res.status(200).json(result);

  } catch (error) {
    console.error('❌ Webhook 处理异常:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
