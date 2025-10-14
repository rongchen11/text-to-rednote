import React, { useState } from 'react';
import { Modal, Form, Input, Button, List, Card, Space, message, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Template } from '../../types';
import { validators } from '../../utils/validators';

const { TextArea } = Input;

interface TemplateModalProps {
  visible: boolean;
  templates: Template[];
  onClose: () => void;
  onAdd: (template: Omit<Template, 'id' | 'isPreset'>) => void;
  onUpdate: (id: string, template: Template) => void;
  onDelete: (id: string) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  visible,
  templates,
  onClose,
  onAdd,
  onUpdate,
  onDelete,
}) => {
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingId) {
        const template = templates.find(t => t.id === editingId);
        if (template) {
          onUpdate(editingId, {
            ...template,
            ...values,
          });
          message.success('Template updated successfully');
        }
      } else {
        onAdd({
          ...values,
          id: `custom_${Date.now()}`,
        });
        message.success('Template added successfully');
      }
      
      form.resetFields();
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleEdit = (template: Template) => {
    if (template.isPreset) {
      message.warning('Preset templates cannot be edited');
      return;
    }
    
    setEditingId(template.id);
    form.setFieldsValue({
      name: template.name,
      coverPrompt: template.coverPrompt,
      contentPrompt: template.contentPrompt,
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const template = templates.find(t => t.id === id);
    if (template?.isPreset) {
      message.warning('Preset templates cannot be deleted');
      return;
    }
    
    onDelete(id);
    message.success('Template deleted successfully');
  };

  const handleCancel = () => {
    form.resetFields();
    setShowForm(false);
    setEditingId(null);
  };

  const customTemplates = templates.filter(t => !t.isPreset);

  return (
    <Modal
      title="Template Management"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={null}
    >
      {!showForm ? (
        <div>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setShowForm(true)}
            className="mb-4"
          >
            Create New Template
          </Button>
          
          <List
            dataSource={customTemplates}
            locale={{ emptyText: 'No custom templates' }}
            renderItem={(template) => (
              <Card
                size="small"
                className="mb-2"
                actions={[
                  <Button
                    type="text"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(template)}
                  >
                    Edit
                  </Button>,
                  <Popconfirm
                    title="Are you sure you want to delete this template?"
                    onConfirm={() => handleDelete(template.id)}
                  >
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      Delete
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  title={template.name}
                  description={
                    <div className="text-xs text-gray-500">
                      <div>Cover Prompt: {template.coverPrompt.slice(0, 50)}...</div>
                      <div>Content Prompt: {template.contentPrompt.slice(0, 50)}...</div>
                    </div>
                  }
                />
              </Card>
            )}
          />
        </div>
      ) : (
        <Form form={form} layout="vertical">
          <Form.Item
            label="Template Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter template name' },
              {
                validator: (_, value) => {
                  if (!value || validators.isValidTemplateName(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Template name should be 1-20 characters long'));
                },
              },
            ]}
          >
            <Input placeholder="e.g.: Tech Style, Artistic Style, etc." />
          </Form.Item>
          
          <Form.Item
            label="Cover Prompt"
            name="coverPrompt"
            rules={[
              { required: true, message: 'Please enter cover prompt' },
              {
                validator: (_, value) => {
                  if (!value || validators.isValidPrompt(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Prompt must contain {content} variable'));
                },
              },
            ]}
            extra="Use {content} as placeholder for text content"
          >
            <TextArea
              rows={3}
              placeholder="Generate a XX-style RedNote cover image with theme: {content}..."
            />
          </Form.Item>
          
          <Form.Item
            label="Content Prompt"
            name="contentPrompt"
            rules={[
              { required: true, message: 'Please enter content prompt' },
              {
                validator: (_, value) => {
                  if (!value || validators.isValidPrompt(value)) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Prompt must contain {content} variable'));
                },
              },
            ]}
            extra="Use {content} as placeholder for text content"
          >
            <TextArea
              rows={3}
              placeholder="Generate a XX-style RedNote content image, content: {content}..."
            />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" onClick={handleSubmit}>
                {editingId ? 'Update' : 'Create'}
              </Button>
              <Button onClick={handleCancel}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};