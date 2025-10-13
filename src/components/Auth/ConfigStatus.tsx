import React from 'react';
import { Alert, Button, Card, Typography, Space } from 'antd';
import { WarningOutlined, CheckCircleOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ConfigStatusProps {
  onOpenSettings?: () => void;
}

export const ConfigStatus: React.FC<ConfigStatusProps> = ({ onOpenSettings }) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const isConfigured = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('your-project-id') && 
    !supabaseAnonKey.includes('your-anon-key');

  if (isConfigured) {
    return (
      <Alert
        message="Supabase Configured"
        description="Authentication system is ready, you can login or register."
        type="success"
        icon={<CheckCircleOutlined />}
        showIcon
        style={{ marginBottom: 16 }}
      />
    );
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Alert
          message="Supabase Configuration Required"
          description="Please follow these steps to configure Supabase and enable authentication."
          type="warning"
          icon={<WarningOutlined />}
          showIcon
        />
        
        <Title level={4}>🚀 Quick Setup Steps:</Title>
        
        <Paragraph>
          <Text strong>1. Create Supabase Project</Text>
          <br />
          Visit <Text code>https://supabase.com</Text> to create a new project
        </Paragraph>
        
        <Paragraph>
          <Text strong>2. Configure Environment Variables</Text>
          <br />
          Add the following to your <Text code>.env</Text> file in the project root:
          <pre style={{ 
            background: '#f5f5f5', 
            padding: '8px', 
            borderRadius: '4px',
            fontSize: '12px',
            marginTop: '8px'
          }}>
{`VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
          </pre>
        </Paragraph>
        
        <Paragraph>
          <Text strong>3. Setup Database</Text>
          <br />
          Execute the SQL code from <Text code>supabase-setup.sql</Text> file in Supabase SQL Editor
        </Paragraph>
        
        <Paragraph>
          <Text type="secondary">
            For detailed setup instructions, see <Text code>SUPABASE_SETUP.md</Text> file
          </Text>
        </Paragraph>
        
        {onOpenSettings && (
          <Button 
            type="primary" 
            icon={<SettingOutlined />}
            onClick={onOpenSettings}
          >
            Open Settings
          </Button>
        )}
      </Space>
    </Card>
  );
};