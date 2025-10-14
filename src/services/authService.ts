import { supabase, type AuthUser, type SignUpData, type SignInData } from './supabaseClient';

export class AuthService {
  
  // Check if Supabase is configured
  private isSupabaseConfigured(): boolean {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    return supabaseUrl && supabaseAnonKey && 
      !supabaseUrl.includes('your-project-id') && 
      !supabaseAnonKey.includes('your-anon-key');
  }

  // 用户注册
  async signUp(data: SignUpData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    
    // Demo mode: provide mock signup functionality when Supabase is not configured
    if (!this.isSupabaseConfigured()) {
      console.log('🎭 Demo mode signup for:', data.username);
      
      // Basic validation (same as real version)
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Password confirmation does not match' };
      }
      
      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }
      
      if (data.username.length < 2) {
        return { success: false, error: 'Username must be at least 2 characters long' };
      }
      
      // Create mock user for demo with bonus credits
      const mockUser: AuthUser = {
        id: `demo-${data.username}`,
        email: `${data.username}@demo.app`,
        username: data.username,
        credits: 100 // New users get 100 credits as advertised
      };
      
      console.log('✅ Demo signup successful for:', mockUser);
      return { 
        success: true, 
        user: mockUser
      };
    }
    
    try {
      // 验证密码确认
      if (data.password !== data.confirmPassword) {
        return { success: false, error: 'Password confirmation does not match' };
      }

      // 验证密码强度
      if (data.password.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' };
      }

      // 验证用户名
      if (data.username.length < 2) {
        return { success: false, error: 'Username must be at least 2 characters long' };
      }

      // 检查用户名是否已存在
      const { data: existingUser } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', data.username)
        .single();

      if (existingUser) {
        return { success: false, error: 'Username already exists' };
      }

      // 使用用户名作为邮箱（Supabase需要邮箱格式）
      const email = `${data.username}@local.app`;

      // 创建用户账户
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: data.password,
        options: {
          data: {
            username: data.username
          },
          emailRedirectTo: undefined // 禁用邮箱确认重定向
        }
      });

      if (authError) {
        console.error('Auth signup error:', authError);
        return { success: false, error: authError.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Registration failed, please try again' };
      }

      // 创建用户档案并赠送100积分
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          id: authData.user.id,
          username: data.username,
          credits: 100, // 首次注册赠送100积分
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // 如果档案创建失败，删除已创建的用户
        await supabase.auth.admin.deleteUser(authData.user.id);
        return { success: false, error: 'Failed to create user profile' };
      }

      // 返回用户信息
      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email,
        username: data.username,
        credits: 100
      };

      return { success: true, user };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'Error occurred during registration' };
    }
  }

  // 用户登录
  async signIn(data: SignInData): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
    
    // Demo mode: provide mock login functionality when Supabase is not configured
    if (!this.isSupabaseConfigured()) {
      console.log('🎭 Demo mode login for:', data.username);
      
      // Basic validation
      if (data.password.length < 3) {
        return { 
          success: false, 
          error: 'Password must be at least 3 characters long' 
        };
      }
      
      // Create mock user for demo
      const mockUser: AuthUser = {
        id: `demo-${data.username}`,
        email: `${data.username}@demo.app`,
        username: data.username,
        credits: 1000 // Give demo users plenty of credits
      };
      
      console.log('✅ Demo login successful for:', mockUser);
      return { 
        success: true, 
        user: mockUser
      };
    }
    
    try {
      // 使用用户名作为邮箱格式
      const email = `${data.username}@local.app`;

      // 登录验证
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password: data.password
      });

      if (authError) {
        console.error('Auth signin error:', authError);
        return { success: false, error: 'Invalid username or password' };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed, please try again' };
      }

      // 获取用户档案信息
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Profile fetch error:', profileError);
        return { success: false, error: 'Failed to fetch user information' };
      }

      // 返回用户信息
      const user: AuthUser = {
        id: authData.user.id,
        email: authData.user.email,
        username: profile.username,
        credits: profile.credits
      };

      return { success: true, user };
    } catch (error) {
      console.error('Signin error:', error);
      return { success: false, error: 'Error occurred during login' };
    }
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
    
    try {
      // 暂时跳过会话检查，直接尝试查询
      console.log('⏭️ AuthService deductCredits - 跳过会话检查，直接查询');
      
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
    try {
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