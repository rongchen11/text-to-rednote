// 测试 Creem API 直接调用
// 在 Node.js 环境中运行此脚本

const API_KEY = 'creem_45FM6wm1YDgdhQ5hREjm6n';
const PRODUCT_IDS = [
  'prod_6vVTmdcL0l4O0D28hZk25L', // $5
  'prod_5okTWJRCBjkApBlR7pEUnh'  // $599
];

async function testCreemAPI() {
  console.log('🧪 测试 Creem API...\n');

  for (const productId of PRODUCT_IDS) {
    console.log(`📦 测试产品: ${productId}`);
    
    try {
      // 尝试创建 checkout session
      const response = await fetch('https://api.creem.io/v1/checkouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify({
          product_id: productId,
          success_url: 'https://example.com/success'
        })
      });

      console.log(`📊 响应状态: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ 成功!');
        console.log(`🔗 Checkout URL: ${result.checkout_url}`);
      } else {
        const error = await response.text();
        console.log(`❌ 失败: ${error}`);
      }
    } catch (err) {
      console.log(`💥 错误: ${err.message}`);
    }
    
    console.log(''); // 空行
  }
}

// 如果在 Node.js 环境中运行
if (typeof fetch === 'undefined') {
  console.log('❌ 需要 Node.js 18+ 或安装 node-fetch');
} else {
  testCreemAPI();
}
