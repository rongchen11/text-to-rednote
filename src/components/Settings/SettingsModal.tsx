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
    doubaoApiKey?: string;
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
  const [doubaoApiKey, setDoubaoApiKey] = useState('');

  React.useEffect(() => {
    if (visible) {
      // 从localStorage读取保存的API密钥
      const savedApiKey = localStorage.getItem('doubao_api_key') || '';
      form.setFieldsValue({
        imageSize: imageSize || '1024x1024',
        doubaoApiKey: savedApiKey,
      });
      setLocalWatermark(watermarkEnabled);
      setDoubaoApiKey(savedApiKey);
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
      
      // 保存API密钥到localStorage
      if (values.doubaoApiKey) {
        localStorage.setItem('doubao_api_key', values.doubaoApiKey);
      } else {
        localStorage.removeItem('doubao_api_key');
      }
      
      onSave({
        imageSize: values.imageSize,
        watermarkEnabled: localWatermark,
        doubaoApiKey: values.doubaoApiKey,
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
        {doubaoApiKey ? (
          <Alert
            message="🎉 Doubao-Seedream-4.0 API Configured"
            description="Your Doubao-Seedream-4.0 API key is ready! You can now generate beautiful images with AI."
            type="success"
            showIcon
          />
        ) : (
          <Alert
            message="⚠️ Doubao-Seedream-4.0 API Key Required"
            description="To enable image generation, you need to provide your own Doubao-Seedream-4.0 API key from Volcengine ARK Console. This ensures you have full control over your usage and costs."
            type="warning"
            showIcon
          />
        )}
      </div>
      
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="🎨 Doubao-Seedream-4.0 API Key"
          name="doubaoApiKey"
          extra={
            <div className="text-sm text-gray-600">
              <div>🔑 <strong>Required:</strong> You need your own Doubao-Seedream-4.0 API key for image generation</div>
              <div>📝 Get your API key from: <a href="https://console.volcengine.com/ark" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Volcengine ARK Console</a></div>
              <div>🔒 Your API key is stored locally in your browser and never sent to our servers</div>
              <div>💡 <strong>Model:</strong> Make sure to enable Doubao-Seedream-4.0 model in your ARK console</div>
            </div>
          }
        >
          <Input.Password 
            placeholder="sk-xxxxx (Enter your Doubao-Seedream-4.0 API key)"
            value={doubaoApiKey}
            onChange={(e) => setDoubaoApiKey(e.target.value)}
          />
        </Form.Item>

        <Divider />

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