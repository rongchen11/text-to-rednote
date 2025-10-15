// Creem 支付服务
export interface CreemPaymentRequest {
  product_id: string;
  success_url?: string;
  cancel_url?: string;
  customer_email?: string;
  metadata?: Record<string, string>;
}

export interface CreemPaymentResponse {
  success: boolean;
  checkout_url?: string;
  session_id?: string;
  error?: string;
}

export interface CreemProduct {
  id: string;
  name: string;
  amount: number;
  credits: number;
  interval: 'month' | 'year' | 'one_time';
}

export class CreemPaymentService {
  
  // 产品配置
  private static readonly PRODUCTS: Record<string, CreemProduct> = {
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

  private static getAppUrl(): string {
    return import.meta.env.VITE_APP_URL || 'https://www.rednotewriter.com';
  }

  /**
   * 获取产品信息
   */
  static getProduct(productId: string): CreemProduct | null {
    return this.PRODUCTS[productId] || null;
  }

  /**
   * 获取所有可用产品
   */
  static getAllProducts(): CreemProduct[] {
    return Object.values(this.PRODUCTS);
  }

  /**
   * 创建支付会话
   */
  static async createCheckoutSession(request: CreemPaymentRequest): Promise<CreemPaymentResponse> {
    try {
      console.log('🚀 创建 Creem 支付会话:', request);
      
      const { product_id, success_url, cancel_url, customer_email, metadata } = request;
      const product = this.getProduct(product_id);
      
      if (!product) {
        throw new Error(`未找到产品: ${product_id}`);
      }

      // 获取用户认证信息
      let accessToken = null;
      let userEmail = customer_email;
      
      try {
        const { supabase } = await import('../services/supabaseClient');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.access_token) {
          accessToken = session.access_token;
          userEmail = userEmail || session.user?.email;
        }
      } catch (error) {
        console.warn('获取用户信息失败:', error);
      }

      const appUrl = this.getAppUrl();
      const checkoutData = {
        product_id,
        success_url: success_url || `${appUrl}/payment/success`,
        cancel_url: cancel_url || `${appUrl}`,
        customer_email: userEmail,
        metadata: {
          credits: product.credits.toString(),
          user_token: accessToken || '',
          ...metadata
        }
      };

      // 调用后端API创建支付会话
      const response = await fetch('/api/payment/creem-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken ? `Bearer ${accessToken}` : ''
        },
        body: JSON.stringify(checkoutData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to create checkout session');
      }

      console.log('✅ Creem 支付会话创建成功:', result);
      
      return {
        success: true,
        checkout_url: result.checkout_url,
        session_id: result.session_id
      };

    } catch (error) {
      console.error('❌ Creem 支付会话创建失败:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '支付会话创建失败'
      };
    }
  }

  /**
   * 跳转到支付页面
   */
  static redirectToCheckout(checkoutUrl: string): void {
    window.location.href = checkoutUrl;
  }

  /**
   * 验证产品ID是否有效
   */
  static isValidProductId(productId: string): boolean {
    return productId in this.PRODUCTS;
  }

  /**
   * 格式化价格显示
   */
  static formatPrice(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
}
