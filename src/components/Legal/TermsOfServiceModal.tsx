import React from 'react';
import { Modal } from 'antd';
import TermsOfService from '../../pages/TermsOfService';

interface TermsOfServiceModalProps {
  visible: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({
  visible,
  onClose,
}) => {
  return (
    <Modal
      title="服务条款"
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
        <TermsOfService />
      </div>
    </Modal>
  );
};
