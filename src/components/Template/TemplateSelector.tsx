import React from 'react';
import { Radio, Space, Button, Empty } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { Template } from '../../types';

interface TemplateSelectorProps {
  templates: Template[];
  selectedId: string;
  onChange: (id: string) => void;
  onAddCustom: () => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  templates,
  selectedId,
  onChange,
  onAddCustom,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-3 font-medium text-gray-700">Template Selection:</div>
      {templates.length === 0 ? (
        <Empty
          description={
            <span className="text-gray-500">
              No templates available, click the button below to create a custom template
            </span>
          }
          imageStyle={{ height: 60 }}
        >
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={onAddCustom}
          >
            Create Custom Template
          </Button>
        </Empty>
      ) : (
        <Radio.Group value={selectedId} onChange={(e) => onChange(e.target.value)}>
          <Space wrap>
            {templates.map((template) => (
              <Radio key={template.id} value={template.id}>
                {template.name}
              </Radio>
            ))}
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              size="small"
              onClick={onAddCustom}
            >
              Custom
            </Button>
          </Space>
        </Radio.Group>
      )}
    </div>
  );
};