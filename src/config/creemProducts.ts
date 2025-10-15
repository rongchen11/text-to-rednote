// Creem 产品配置
// 管理 Creem 产品ID与应用内积分的映射关系

export interface CreemProductConfig {
  id: string;              // Creem 产品ID
  name: string;           // 产品名称
  description: string;    // 产品描述
  amount: number;         // 价格（美元）
  credits: number;        // 对应积分数量
  interval: 'one_time' | 'month' | 'year';  // 计费周期
  popular?: boolean;      // 是否为热门产品
  discount?: {
    percentage: number;   // 折扣百分比
    originalAmount: number;  // 原价
  };
}

// 从用户提供的产品ID配置
export const creemProducts: CreemProductConfig[] = [
  {
    id: 'prod_HkeKrlWaQEY0fdi1tndhR',
    name: '积分包 - 基础版',
    description: '适合轻度使用，100积分让您体验核心功能',
    amount: 5,
    credits: 100,
    interval: 'one_time',
    popular: false
  },
  {
    id: 'prod_5ttzeSFClCVV7Xchzc8rYu',
    name: '积分包 - 专业版',
    description: '为重度用户设计，15000积分满足大量创作需求',
    amount: 599,
    credits: 15000,
    interval: 'one_time',
    popular: true,
    discount: {
      percentage: 20,
      originalAmount: 749
    }
  }
];

// 根据产品ID获取产品配置
export function getCreemProduct(productId: string): CreemProductConfig | undefined {
  return creemProducts.find(product => product.id === productId);
}

// 获取所有产品
export function getAllCreemProducts(): CreemProductConfig[] {
  return creemProducts;
}

// 获取热门产品
export function getPopularCreemProducts(): CreemProductConfig[] {
  return creemProducts.filter(product => product.popular);
}

// 根据积分数量推荐产品
export function getRecommendedProduct(targetCredits: number): CreemProductConfig | undefined {
  return creemProducts
    .filter(product => product.credits >= targetCredits)
    .sort((a, b) => a.credits - b.credits)[0];
}

// 计算实际支付金额（考虑折扣）
export function getActualPrice(product: CreemProductConfig): number {
  if (product.discount) {
    return product.amount;
  }
  return product.amount;
}

// 计算节省金额
export function getSavingAmount(product: CreemProductConfig): number {
  if (product.discount) {
    return product.discount.originalAmount - product.amount;
  }
  return 0;
}

// 格式化价格显示
export function formatPrice(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// 格式化积分显示
export function formatCredits(credits: number): string {
  return credits.toLocaleString() + ' 积分';
}

// 计算每积分价格（用于比较性价比）
export function getPricePerCredit(product: CreemProductConfig): number {
  return product.amount / product.credits;
}

// 验证产品ID是否有效
export function isValidProductId(productId: string): boolean {
  return creemProducts.some(product => product.id === productId);
}
