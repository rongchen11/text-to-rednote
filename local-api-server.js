// 本地API服务器，用于开发环境
import express from 'express';
import cors from 'cors';
import crypto from 'crypto';

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// Z-Pay 签名算法
function getVerifyParams(params) {
  var sPara = [];
  if (!params) return null;
  
  for (var key in params) {
    if ((!params[key]) || key == "sign" || key == "sign_type") {
      continue;
    }
    sPara.push([key, params[key]]);
  }
  
  sPara = sPara.sort();
  
  var prestr = '';
  for (var i2 = 0; i2 < sPara.length; i2++) {
    var obj = sPara[i2];
    if (i2 == sPara.length - 1) {
      prestr = prestr + obj[0] + '=' + obj[1] + '';
    } else {
      prestr = prestr + obj[0] + '=' + obj[1] + '&';
    }
  }
  return prestr;
}

function generateSign(paramString, key) {
  const signString = paramString + key;
  return crypto.createHash('md5').update(signString, 'utf8').digest('hex');
}

function generateOrderNo() {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORDER${timestamp}${random}`;
}

// 支付URL生成接口
app.post('/api/payment/zpay-url-simple', (req, res) => {
  try {
    console.log('收到支付请求:', req.body);
    
    const { product_name, amount, credits, payment_type = 'wxpay' } = req.body;
    
    if (!product_name || !amount || !credits) {
      return res.status(400).json({ 
        error: '缺少必需参数',
        message: '请提供 product_name, amount 和 credits' 
      });
    }
    
    const outTradeNo = generateOrderNo();
    
    const zpayParams = {
      pid: process.env.ZPAY_PID || 'demo_pid',
      money: parseFloat(amount).toFixed(2),
      name: product_name,
      notify_url: 'http://localhost:5173/api/payment/zpay-webhook',
      out_trade_no: outTradeNo,
      return_url: 'http://localhost:5173/payment/success',
      sitename: '文字转小红书',
      type: payment_type,
      param: `积分充值-${credits}积分`
    };
    
    const paramString = getVerifyParams(zpayParams);
    const sign = generateSign(paramString, process.env.ZPAY_KEY || 'demo_key');
    
    zpayParams.sign = sign;
    zpayParams.sign_type = 'MD5';
    
    const paymentUrl = `https://z-pay.cn/submit.php?${new URLSearchParams(zpayParams).toString()}`;
    
    console.log('生成支付URL成功');
    
    res.json({
      success: true,
      payment_url: paymentUrl,
      form_data: zpayParams,
      form_action: 'https://z-pay.cn/submit.php',
      out_trade_no: outTradeNo,
      method: 'POST',
      debug_info: {
        param_string: paramString,
        sign: sign
      }
    });
    
  } catch (error) {
    console.error('支付URL生成错误:', error);
    res.status(500).json({ 
      error: '服务器内部错误',
      message: error.message
    });
  }
});

// 图片生成接口
app.post('/api/images', async (req, res) => {
  console.log('🖼️  收到图片生成请求:', req.body);
  
  try {
    // 获取API密钥
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        error: '需要API密钥',
        message: '图片生成功能需要您提供豆包API密钥。AI拆分功能仍可免费使用。',
        type: 'API_KEY_REQUIRED',
        guide: '请在设置中配置您的豆包API密钥，或查看API密钥申请教程'
      });
    }
    
    console.log('🔑 使用API密钥:', apiKey.substring(0, 10) + '...');
    
    // 构建请求到豆包图片生成 API
    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    
    console.log('📡 豆包API响应状态:', response.status);
    
    // 获取响应数据
    const data = await response.json();
    console.log('📦 豆包API响应数据:', data);
    
    // 检查响应状态
    if (!response.ok) {
      console.error('❌ 豆包图片API错误:', data);
      
      // 处理特定错误码
      if (response.status === 401) {
        return res.status(401).json({ 
          error: 'API密钥无效或已过期',
          originalError: data 
        });
      } else if (response.status === 429) {
        return res.status(429).json({ 
          error: '请求过于频繁，请稍后再试',
          originalError: data 
        });
      }
      
      return res.status(response.status).json(data);
    }
    
    console.log('✅ 图片生成成功');
    // 返回成功响应
    res.status(200).json(data);
  } catch (error) {
    console.error('❌ 图片生成代理错误:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
});

// 测试接口
app.post('/api/test-payment', (req, res) => {
  console.log('收到测试请求:', req.body);
  res.json({
    success: true,
    message: '测试API正常工作',
    received_data: req.body,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 本地API服务器运行在 http://localhost:${PORT}`);
  console.log('💳 支付API端点: http://localhost:3001/api/payment/zpay-url-simple');
  console.log('🖼️  图片API端点: http://localhost:3001/api/images');
});
