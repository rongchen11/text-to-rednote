import React, { useState } from 'react';
import { Button, Popover } from 'antd';
import { LoginOutlined, WarningOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { LoginModal } from './LoginModal';
import { UserProfile } from './UserProfile';
import { ConfigStatus } from './ConfigStatus';

interface AuthButtonProps {
  onOpenSettings?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onOpenSettings }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Check Supabase configuration status
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const isConfigured = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') && 
    !supabaseAnonKey.includes('your-anon-key');

  // If authenticated, show user profile
   if (isAuthenticated && user) {
     return <UserProfile onOpenSettings={onOpenSettings} />;
   }

  // If Supabase not configured, show configuration hint
  if (!isConfigured) {
    return (
      <Popover
        content={<ConfigStatus onOpenSettings={onOpenSettings} />}
        title="Supabase Configuration Required"
        trigger="click"
        placement="bottomRight"
        overlayStyle={{ maxWidth: 400 }}
      >
        <Button
          type="default"
          icon={<WarningOutlined />}
          style={{ color: '#faad14', borderColor: '#faad14' }}
        >
          Setup Auth
        </Button>
      </Popover>
    );
  }

  // Show normal login button
  return (
    <>
      <Button
        type="primary"
        icon={<LoginOutlined />}
        onClick={() => setShowLoginModal(true)}
      >
        Login
      </Button>
      
      <LoginModal
         visible={showLoginModal}
         onClose={() => setShowLoginModal(false)}
       />
    </>
  );
};