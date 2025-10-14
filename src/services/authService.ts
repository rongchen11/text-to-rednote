import { supabase, type AuthUser, type SignUpData, type SignInData } from './supabaseClient';

export class AuthService {
  
  // Check if Supabase is configured
  private isSupabaseConfigured(): boolean {
    // 🎭 强制演示模式：永远返回false以确保使用localStorage模拟
    console.log('🎭 FORCE DEMO MODE: Always using localStorage simulation');
    return false;
    
    /* 原来的检测逻辑，暂时禁用
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    console.log('🔍 Supabase configuration check:', {
      supabaseUrl: supabaseUrl ? 'Present' : 'Missing',
      supabaseAnonKey: supabaseAnonKey ? 'Present' : 'Missing',
      urlContent: supabaseUrl,
      keyContent: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 10)}...` : 'None'
    });
    
    const isConfigured = supabaseUrl && supabaseAnonKey && 
      !supabaseUrl.includes('your-project-id') && 
      !supabaseAnonKey.includes('your-anon-key') &&
      supabaseUrl.startsWith('https://') &&
      supabaseUrl.includes('.supabase.co');
    
    console.log('🎭 Supabase configured?', isConfigured ? 'YES - Real mode' : 'NO - Demo mode');
    return isConfigured;
    */
  }

  // 用户注册
  async signUp(data: SignUpData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    
    // 简化演示模式
    console.log('🎭 Simple signup for:', data.username);
    
    // 基本验证
    if (data.password !== data.confirmPassword) {
      return { success: false, error: 'Password confirmation does not match' };
    }
    
    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }
    
    // 用户名验证
    if (!data.username || data.username.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' };
    }
    
    // 创建简单用户
    const mockUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: `${data.username}@demo.com`,
      username: data.username,
      credits: 100, // 新用户获得100积分
      hasReceivedFreeCredits: true // 注册时已获得免费积分
    };
    
    console.log('✅ Registration successful for:', mockUser);
    return { 
      success: true, 
      user: mockUser
    };
  }

  // 用户登录
  async signIn(data: SignInData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    
    // 简化演示模式登录  
    console.log('🎭 Simple login for:', data.username);
    
    // 基本验证
    if (data.password.length < 3) {
      return { 
        success: false, 
        error: 'Password must be at least 3 characters long' 
      };
    }
    
    // 用户名验证
    if (!data.username || data.username.length < 3) {
      return { 
        success: false, 
        error: 'Username must be at least 3 characters long' 
      };
    }
    
    // 模拟检查用户是否首次登录（演示模式）
    // 在真实环境中，这里会查询数据库
    const isFirstTimeLogin = !localStorage.getItem(`user_${data.username}_visited`);
    
    // 创建简单登录用户
    const mockUser: AuthUser = {
      id: `user-${Date.now()}`,
      email: `${data.username}@demo.com`,
      username: data.username,
      credits: isFirstTimeLogin ? 100 : 0, // 首次登录100积分，否则0积分
      hasReceivedFreeCredits: isFirstTimeLogin // 首次登录时获得免费积分
    };
    
    // 标记用户已经访问过
    if (isFirstTimeLogin) {
      localStorage.setItem(`user_${data.username}_visited`, 'true');
    }
    
    console.log('✅ Login successful for:', mockUser);
    return { 
      success: true, 
      user: mockUser
    };
  }

  // 用户登出
  async signOut(): Promise<{ success: boolean; error?: string }> {
    
    // Demo mode: always successful logout
    if (!this.isSupabaseConfigured()) {
      console.log('🎭 Demo mode logout - always successful');
      return { success: true };
    }
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Signout error:', error);
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (error) {
      console.error('Signout error:', error);
      return { success: false, error: 'Error occurred during logout' };
    }
  }

  // 获取当前用户
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return null;
      }

      // 获取用户档案
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !profile) {
        console.error('Profile fetch error:', error);
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        username: profile.username,
        credits: profile.credits
      };
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  // 更新用户积分
  async updateCredits(userId: string, newCredits: number): Promise<{ success: boolean; error?: string }> {
    console.log('🔍 AuthService updateCredits - 开始更新积分:', { userId, newCredits });
    
    try {
      const updateData = { 
        credits: newCredits,
        updated_at: new Date().toISOString()
      };
      console.log('📝 AuthService updateCredits - 更新数据:', updateData);
      
      const { data, error, count } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('id', userId)
        .select(); // 添加 select 来获取更新后的数据

      console.log('📊 AuthService updateCredits - Supabase 响应:', { data, error, count });

      if (error) {
        console.error('❌ AuthService updateCredits - Supabase 错误:', error);
        return { success: false, error: '积分更新失败' };
      }

      if (!data || data.length === 0) {
        console.log('⚠️ AuthService updateCredits - 没有行被更新，可能用户ID不存在');
        return { success: false, error: '用户不存在或无权限更新' };
      }

      console.log('✅ AuthService updateCredits - 更新成功:', data[0]);
      return { success: true };
    } catch (error) {
      console.error('❌ AuthService updateCredits - 异常:', error);
      return { success: false, error: '积分更新过程中发生错误' };
    }
  }

  // 扣除积分
  async deductCredits(userId: string, amount: number): Promise<{ success: boolean; newCredits?: number; error?: string }> {
    console.log('🔍 AuthService deductCredits - 开始扣除积分:', { userId, amount });
    
    // 检查是否配置了 Supabase
    if (!this.isSupabaseConfigured()) {
      console.log('🎭 AuthService deductCredits - 演示模式，模拟积分扣除');
      
      // 演示模式：从 localStorage 模拟积分管理
      try {
        const userKey = `demo_user_${userId}`;
        let userData = JSON.parse(localStorage.getItem(userKey) || '{}');
        
        const currentCredits = userData.credits || 100; // 默认100积分
        console.log('💰 演示模式 - 当前积分:', currentCredits);
        
        if (currentCredits < amount) {
          console.log('❌ 演示模式 - 积分不足:', { current: currentCredits, required: amount });
          return { success: false, error: '积分不足' };
        }
        
        const newCredits = currentCredits - amount;
        userData.credits = newCredits;
        localStorage.setItem(userKey, JSON.stringify(userData));
        
        console.log('✅ 演示模式 - 积分扣除成功:', { newCredits });
        return { success: true, newCredits };
      } catch (error) {
        console.error('❌ 演示模式积分扣除失败:', error);
        return { success: false, error: '演示模式积分扣除失败' };
      }
    }
    
    try {
      // 真实 Supabase 模式
      console.log('🔍 AuthService deductCredits - Supabase 模式，查询数据库');
      
      // 先获取当前积分
      console.log('📋 AuthService deductCredits - 查询用户积分');
      
      // 先测试简单查询
      console.log('🧪 AuthService deductCredits - 测试基础查询');
      const testQuery = await supabase
        .from('user_profiles')
        .select('id, credits')
        .limit(1);
      console.log('🧪 AuthService deductCredits - 基础查询结果:', testQuery);
      
      // 添加超时处理
      const queryPromise = supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', userId)
        .single();
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('查询超时')), 10000); // 10秒超时
      });
      
      let profile, fetchError;
      try {
        const result = await Promise.race([queryPromise, timeoutPromise]);
        profile = result.data;
        fetchError = result.error;
      } catch (error) {
        console.log('⏰ AuthService deductCredits - 查询超时或失败:', error);
        fetchError = error;
        profile = null;
      }

      console.log('📊 AuthService deductCredits - 查询结果:', { profile, fetchError });

      if (fetchError || !profile) {
        console.log('❌ AuthService deductCredits - 获取用户积分失败:', fetchError);
        return { success: false, error: '获取用户积分失败' };
      }

      const currentCredits = profile.credits;
      console.log('💰 AuthService deductCredits - 当前积分:', currentCredits);
      
      if (currentCredits < amount) {
        console.log('❌ AuthService deductCredits - 积分不足:', { current: currentCredits, required: amount });
        return { success: false, error: '积分不足' };
      }

      const newCredits = currentCredits - amount;
      console.log('🔢 AuthService deductCredits - 计算新积分:', { current: currentCredits, deduct: amount, new: newCredits });

      // 更新积分
      console.log('🔄 AuthService deductCredits - 调用 updateCredits');
      const updateResult = await this.updateCredits(userId, newCredits);
      console.log('📊 AuthService deductCredits - updateCredits 结果:', updateResult);
      
      if (!updateResult.success) {
        console.log('❌ AuthService deductCredits - 更新积分失败:', updateResult);
        return updateResult;
      }

      console.log('✅ AuthService deductCredits - 扣除成功:', { newCredits });
      return { success: true, newCredits };
    } catch (error) {
      console.error('❌ AuthService deductCredits - 异常:', error);
      return { success: false, error: '扣除积分过程中发生错误' };
    }
  }

  // 增加积分
  async addCredits(userId: string, amount: number): Promise<{ success: boolean; newCredits?: number; error?: string }> {
    console.log('🔍 AuthService addCredits - 开始增加积分:', { userId, amount });
    
    // 检查是否配置了 Supabase
    if (!this.isSupabaseConfigured()) {
      console.log('🎭 AuthService addCredits - 演示模式，模拟积分增加');
      
      // 演示模式：从 localStorage 模拟积分管理
      try {
        const userKey = `demo_user_${userId}`;
        let userData = JSON.parse(localStorage.getItem(userKey) || '{}');
        
        const currentCredits = userData.credits || 100; // 默认100积分
        console.log('💰 演示模式 - 当前积分:', currentCredits);
        
        const newCredits = currentCredits + amount;
        userData.credits = newCredits;
        localStorage.setItem(userKey, JSON.stringify(userData));
        
        console.log('✅ 演示模式 - 积分增加成功:', { newCredits });
        return { success: true, newCredits };
      } catch (error) {
        console.error('❌ 演示模式积分增加失败:', error);
        return { success: false, error: '演示模式积分增加失败' };
      }
    }
    
    try {
      // 真实 Supabase 模式
      console.log('🔍 AuthService addCredits - Supabase 模式，查询数据库');
      
      // 先获取当前积分
      const { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('credits')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        return { success: false, error: '获取用户积分失败' };
      }

      const newCredits = profile.credits + amount;

      // 更新积分
      const updateResult = await this.updateCredits(userId, newCredits);
      if (!updateResult.success) {
        return updateResult;
      }

      return { success: true, newCredits };
    } catch (error) {
      console.error('Add credits error:', error);
      return { success: false, error: '增加积分过程中发生错误' };
    }
  }

  // 监听认证状态变化
  onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (_, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}

// 导出单例实例
export const authService = new AuthService();