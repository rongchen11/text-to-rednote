// 免费积分服务
// 用于处理免费试用积分的发放和管理

export interface FreeCreditsRequest {
  userId: string;
  credits: number;
  reason: string; // 'trial', 'welcome', 'promotion' 等
}

export interface FreeCreditsResponse {
  success: boolean;
  message: string;
  newBalance?: number;
  error?: string;
}

export class FreeCreditsService {
  // 为用户发放免费积分
  static async grantFreeCredits(request: FreeCreditsRequest): Promise<FreeCreditsResponse> {
    try {
      // TODO: 实现实际的免费积分发放逻辑
      // 1. 验证用户是否有资格获得免费积分
      // 2. 检查是否已经获得过同类型的免费积分
      // 3. 调用后端API更新用户积分余额
      // 4. 记录免费积分发放日志
      
      console.log('🎁 发放免费积分:', request);
      
      // 模拟API调用
      const response = await fetch('/api/credits/free', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 这里需要添加用户认证token
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to grant free credits: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('免费积分发放失败:', error);
      return {
        success: false,
        message: 'Failed to grant free credits',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  // 检查用户是否有资格获得免费积分
  static async checkEligibility(userId: string, type: string = 'trial'): Promise<boolean> {
    try {
      // TODO: 实现资格检查逻辑
      // 1. 检查用户注册时间
      // 2. 检查是否已经获得过该类型的免费积分
      // 3. 检查账户状态等
      
      console.log('🔍 检查免费积分资格:', { userId, type });
      
      // 模拟检查逻辑
      const response = await fetch(`/api/credits/eligibility?userId=${userId}&type=${type}`);
      
      if (!response.ok) {
        return false;
      }
      
      const result = await response.json();
      return result.eligible || false;
      
    } catch (error) {
      console.error('资格检查失败:', error);
      return false;
    }
  }
  
  // 获取免费积分历史记录
  static async getFreeCreditsHistory(userId: string): Promise<any[]> {
    try {
      console.log('📜 获取免费积分历史:', userId);
      
      const response = await fetch(`/api/credits/history/free?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch free credits history');
      }
      
      const result = await response.json();
      return result.history || [];
      
    } catch (error) {
      console.error('获取免费积分历史失败:', error);
      return [];
    }
  }
}

// Creem集成相关的接口和类型定义
export interface CreemProduct {
  product_id: string;
  name: string;
  description: string;
  price: number;
  currency: 'USD' | 'EUR' | 'GBP';
  credits: number; // -1 表示无限积分
  metadata?: {
    isFree?: boolean;
    isUnlimited?: boolean;
    bonus?: number;
  };
}

export interface CreemCheckoutRequest {
  product_id: string;
  customer_email?: string;
  success_url?: string;
  cancel_url?: string;
  metadata?: Record<string, any>;
}

export interface CreemCheckoutResponse {
  checkout_url: string;
  session_id: string;
  expires_at: string;
}

export class CreemService {
  // 创建Creem结账会话
  static async createCheckoutSession(request: CreemCheckoutRequest): Promise<CreemCheckoutResponse> {
    try {
      console.log('🚀 创建Creem结账会话:', request);
      
      // TODO: 实现Creem API集成
      const response = await fetch('/api/creem/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Creem API密钥认证
        },
        body: JSON.stringify(request)
      });
      
      if (!response.ok) {
        throw new Error(`Creem API error: ${response.statusText}`);
      }
      
      const result = await response.json();
      return result;
      
    } catch (error) {
      console.error('Creem结账会话创建失败:', error);
      throw error;
    }
  }
  
  // 获取可用的产品列表
  static async getProducts(): Promise<CreemProduct[]> {
    try {
      console.log('📦 获取Creem产品列表');
      
      // TODO: 从Creem API获取产品列表
      const response = await fetch('/api/creem/products');
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const result = await response.json();
      return result.products || [];
      
    } catch (error) {
      console.error('获取产品列表失败:', error);
      return [];
    }
  }
  
  // 验证支付结果
  static async verifyPayment(sessionId: string): Promise<boolean> {
    try {
      console.log('✅ 验证支付结果:', sessionId);
      
      const response = await fetch(`/api/creem/verify?session_id=${sessionId}`);
      
      if (!response.ok) {
        return false;
      }
      
      const result = await response.json();
      return result.verified || false;
      
    } catch (error) {
      console.error('支付验证失败:', error);
      return false;
    }
  }
}
