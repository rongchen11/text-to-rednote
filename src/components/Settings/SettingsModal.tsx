import React, { useState } from 'react';
import { Modal, Form, Input, Button, Switch, Tag, Divider, message, Alert } from 'antd';
import { PRESET_SIZES } from '../../utils/constants';

interface SettingsModalProps {
  visible: boolean;
  imageSize: string;
  watermarkEnabled: boolean;
  onClose: () => void;
  onSave: (settings: {
    imageSize: string;
    watermarkEnabled: boolean;
  }) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  imageSize,
  watermarkEnabled,
  onClose,
  onSave,
}) => {
  const [form] = Form.useForm();
  const [localWatermark, setLocalWatermark] = useState(watermarkEnabled);

  React.useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        imageSize: imageSize || '1024x1024',
      });
      setLocalWatermark(watermarkEnabled);
    }
  }, [visible, imageSize, watermarkEnabled, form]);

  const validateImageSize = (_: any, value: string) => {
    if (!value) return Promise.resolve();
    const pattern = /^\d+x\d+$/;
    if (!pattern.test(value)) {
      return Promise.reject(new Error('Invalid format, please enter like 1024x1024'));
    }
    const [width, height] = value.split('x').map(Number);
    if (width < 256 || width > 4096 || height < 256 || height > 4096) {
      return Promise.reject(new Error('Size range: 256-4096 pixels'));
    }
    return Promise.resolve();
  };

  const handlePresetClick = (size: string) => {
    form.setFieldValue('imageSize', size);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      onSave({
        imageSize: values.imageSize,
        watermarkEnabled: localWatermark,
      });
      message.success('Settings saved successfully');
      onClose();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title="⚙️ Generation Settings"
      open={visible}
      onCancel={onClose}
      width={600}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Save Settings
        </Button>,
      ]}
    >
      <div className="space-y-4">
        <Alert
          message="Credit-based Image Generation"
          description="Image generation service is configured. Each image costs 20 credits (≈ $0.2). You can purchase credits to use the image generation feature."
          type="info"
          showIcon
        />
      </div>
      
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="Image Size"
          name="imageSize"
          rules={[{ validator: validateImageSize }]}
          extra="Format: width×height, e.g. 2048x2048 (Range: 256-4096)"
        >
          <Input placeholder="1024x1024" />
        </Form.Item>

        <div className="mb-4">
          <span className="mr-2">Common Sizes:</span>
          {PRESET_SIZES.map(preset => (
            <Tag
              key={preset.value}
              onClick={() => handlePresetClick(preset.value)}
              style={{ cursor: 'pointer', marginBottom: 8 }}
              color="blue"
            >
              {preset.label}
            </Tag>
          ))}
        </div>

        <Divider />

        <Form.Item label="Image Watermark">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Whether generated images contain watermark</span>
            <Switch
              checked={localWatermark}
              onChange={setLocalWatermark}
              checkedChildren="On"
              unCheckedChildren="Off"
            />
          </div>
        </Form.Item>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-blue-800 font-medium mb-2">💡 Usage Guide</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Each image generation costs 20 credits</li>
            <li>• New users get 100 credits upon registration</li>
            <li>• Purchase credits to continue using the service</li>
            <li>• Failed generations won't deduct credits</li>
          </ul>
        </div>
      </Form>
    </Modal>
  );
};