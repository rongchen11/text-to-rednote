import React, { useState } from 'react';
import { Button } from 'antd';
import { LoginOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../stores/useAuthStore';
import { LoginModal } from './LoginModal';
import { UserProfile } from './UserProfile';

interface AuthButtonProps {
  onOpenSettings?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ onOpenSettings }) => {
  const { user, isAuthenticated } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  
  // Supabase configuration check removed for demo mode

  // If authenticated, show user profile
   if (isAuthenticated && user) {
     return <UserProfile onOpenSettings={onOpenSettings} />;
   }

  // Temporarily disable Supabase check - always show login for demo
  // if (!isConfigured) {
  //   return (
  //     <Popover
  //       content={<ConfigStatus onOpenSettings={onOpenSettings} />}
  //       title="Supabase Configuration Required"
  //       trigger="click"
  //       placement="bottomRight"
  //       overlayStyle={{ maxWidth: 400 }}
  //     >
  //       <Button
  //         type="default"
  //         icon={<WarningOutlined />}
  //         style={{ color: '#faad14', borderColor: '#faad14' }}
  //       >
  //         Setup Auth
  //       </Button>
  //     </Popover>
  //   );
  // }

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