import { create } from 'zustand';
import { authService } from '../services/authService';
import type { AuthUser, SignUpData, SignInData } from '../services/supabaseClient';
import { message } from 'antd';

interface AuthStore {
  // 状态
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signUp: (data: SignUpData) => Promise<boolean>;
  signIn: (data: SignInData) => Promise<boolean>;
  signOut: () => Promise<void>;
  updateCredits: (newCredits: number) => void;
  deductCredits: (amount: number) => Promise<boolean>;
  addCredits: (amount: number) => Promise<boolean>;
  initializeAuth: () => Promise<void>;
  setUser: (user: AuthUser | null) => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  // 初始状态
  user: null,
  isLoading: false,
  isAuthenticated: false,

  // 用户注册
  signUp: async (data: SignUpData) => {
    set({ isLoading: true });
    try {
      const result = await authService.signUp(data);
      
      if (result.success && result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true,
          isLoading: false 
        });
        message.success('Registration successful! 100 credits have been added to your account');
        return true;
      } else {
        message.error(result.error || 'Registration failed');
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('SignUp error:', error);
      message.error('Error occurred during registration');
      set({ isLoading: false });
      return false;
    }
  },

  // 用户登录
  signIn: async (data: SignInData) => {
    set({ isLoading: true });
    try {
      const result = await authService.signIn(data);
      
      if (result.success && result.user) {
        set({ 
          user: result.user, 
          isAuthenticated: true,
          isLoading: false 
        });
        message.success(`Welcome back, ${result.user.username}!`);
        return true;
      } else {
        message.error(result.error || 'Login failed');
        set({ isLoading: false });
        return false;
      }
    } catch (error) {
      console.error('SignIn error:', error);
      message.error('Error occurred during login');
      set({ isLoading: false });
      return false;
    }
  },

  // 用户登出
  signOut: async () => {
    set({ isLoading: true });
    try {
      const result = await authService.signOut();
      
      if (result.success) {
        set({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false 
        });
        message.success('Successfully logged out');
      } else {
        message.error(result.error || 'Logout failed');
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('SignOut error:', error);
      message.error('Error occurred during logout');
      set({ isLoading: false });
    }
  },

  // 更新积分（本地状态）
  updateCredits: (newCredits: number) => {
    const { user } = get();
    if (user) {
      set({ 
        user: { ...user, credits: newCredits }
      });
    }
  },

  // 扣除积分
  deductCredits: async (amount: number) => {
    const { user } = get();
    console.log('🔍 Store deductCredits - 用户信息:', user ? { id: user.id, credits: user.credits } : '无用户');
    
    if (!user) {
      console.log('❌ Store deductCredits - 用户未登录');
      message.error('Please log in');
      return false;
    }

    try {
      console.log('🚀 Store deductCredits - 调用 authService.deductCredits:', { userId: user.id, amount });
      const result = await authService.deductCredits(user.id, amount);
      console.log('📊 Store deductCredits - authService 返回结果:', result);
      
      if (result.success && result.newCredits !== undefined) {
        console.log('✅ Store deductCredits - 更新本地状态:', { oldCredits: user.credits, newCredits: result.newCredits });
        get().updateCredits(result.newCredits);
        return true;
      } else {
        console.log('❌ Store deductCredits - 扣除失败:', result.error);
        message.error(result.error || 'Failed to deduct credits');
        return false;
      }
    } catch (error) {
      console.error('❌ Store deductCredits - 异常:', error);
      message.error('Error occurred while deducting credits');
      return false;
    }
  },

  // 增加积分
  addCredits: async (amount: number) => {
    const { user } = get();
    if (!user) {
      message.error('Please log in');
      return false;
    }

    try {
      const result = await authService.addCredits(user.id, amount);
      
      if (result.success && result.newCredits !== undefined) {
        get().updateCredits(result.newCredits);
        message.success(`Successfully received ${amount} credits`);
        return true;
      } else {
        message.error(result.error || 'Failed to add credits');
        return false;
      }
    } catch (error) {
      console.error('Add credits error:', error);
      message.error('Error occurred while adding credits');
      return false;
    }
  },

  // 初始化认证状态
  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: !!user,
        isLoading: false 
      });

      // 监听认证状态变化
      authService.onAuthStateChange((user) => {
        set({ 
          user, 
          isAuthenticated: !!user 
        });
      });
    } catch (error) {
      console.error('Initialize auth error:', error);
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  // 设置用户（用于外部更新）
  setUser: (user: AuthUser | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  }
}));