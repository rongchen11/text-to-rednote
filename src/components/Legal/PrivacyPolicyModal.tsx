import React from 'react';
import { Modal } from 'antd';
import PrivacyPolicy from '../../pages/PrivacyPolicy';

interface PrivacyPolicyModalProps {
  visible: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      title="Privacy Policy"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      style={{ top: 20 }}
      bodyStyle={{ 
        maxHeight: '80vh', 
        overflow: 'auto',
        padding: 0
      }}
    >
      <div className="p-6">
        <PrivacyPolicy />
      </div>
    </Modal>
  );
};
