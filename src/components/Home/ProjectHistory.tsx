import React from 'react';
import { Card, Typography, Row, Col, Button, Tag, Space, Empty, Image } from 'antd';
import { 
  ClockCircleOutlined, 
  DeleteOutlined,
  PlusOutlined,
  FileTextOutlined,
  CoffeeOutlined,
  SkinOutlined,
  ShoppingOutlined,
  BookOutlined,
  HeartOutlined
} from '@ant-design/icons';
import type { RecentProject } from '../../stores/useAppStore';

const { Text, Title } = Typography;

interface ProjectHistoryProps {
  projects: RecentProject[];
  onProjectClick: (projectId: string) => void;
  onClearHistory: () => void;
}

export const ProjectHistory: React.FC<ProjectHistoryProps> = ({ 
  projects, 
  onProjectClick, 
  onClearHistory 
}) => {
  // Return corresponding icon based on project name
  const getProjectIcon = (name: string) => {
    if (name.includes('food') || name.includes('coffee') || name.includes('cafe') || name.includes('restaurant') || name.includes('美食') || name.includes('咖啡') || name.includes('餐')) {
      return <CoffeeOutlined className="text-2xl text-orange-500" />;
    }
    if (name.includes('skincare') || name.includes('makeup') || name.includes('beauty') || name.includes('护肤') || name.includes('化妆') || name.includes('美妆')) {
      return <SkinOutlined className="text-2xl text-pink-500" />;
    }
    if (name.includes('outfit') || name.includes('shopping') || name.includes('fashion') || name.includes('穿搭') || name.includes('购物') || name.includes('买')) {
      return <ShoppingOutlined className="text-2xl text-purple-500" />;
    }
    if (name.includes('book') || name.includes('study') || name.includes('work') || name.includes('learning') || name.includes('读书') || name.includes('学习') || name.includes('工作')) {
      return <BookOutlined className="text-2xl text-blue-500" />;
    }
    if (name.includes('fitness') || name.includes('workout') || name.includes('health') || name.includes('exercise') || name.includes('运动') || name.includes('健身') || name.includes('健康')) {
      return <HeartOutlined className="text-2xl text-red-500" />;
    }
    return <FileTextOutlined className="text-2xl text-gray-500" />;
  };
  
  // Format date display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    if (days < 30) return `${Math.floor(days / 7)}w ago`;
    return date.toLocaleDateString();
  };
  
  if (projects.length === 0) {
    return (
      <Card className="mb-6 animate-fadeInUp">
        <Empty 
          description="No history records"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }
  
  return (
    <div className="animate-fadeInUp">
      <div className="flex justify-between items-center mb-4">
        <Space>
          <ClockCircleOutlined className="text-lg" />
          <Title level={5} className="!mb-0">Recent Projects</Title>
        </Space>
        <Button 
          size="small" 
          type="text" 
          danger
          icon={<DeleteOutlined />}
          onClick={onClearHistory}
        >
          Clear History
        </Button>
      </div>
      
      <Row gutter={[16, 16]}>
        {projects.slice(0, 5).map(project => (
          <Col key={project.id} xs={24} sm={12} md={8} lg={8} xl={6}>
            <Card
              hoverable
              className="project-card h-full"
              onClick={() => onProjectClick(project.id)}
              cover={
                project.thumbnail ? (
                  <div className="h-32 overflow-hidden bg-gray-100">
                    <Image
                      src={project.thumbnail}
                      alt={project.name}
                      preview={false}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                    {getProjectIcon(project.name)}
                  </div>
                )
              }
            >
              <Card.Meta
                title={
                  <div className="flex items-center justify-between">
                    <Text strong ellipsis className="flex-1">
                      {project.name}
                    </Text>
                  </div>
                }
                description={
                  <div className="space-y-1">
                    <Text type="secondary" className="text-xs">
                      {project.wordCount} chars
                    </Text>
                    <Tag color="blue" className="text-xs">
                      {formatDate(project.date)}
                    </Tag>
                  </div>
                }
              />
            </Card>
          </Col>
        ))}
        
        {/* View more card */}
        {projects.length > 5 && (
          <Col xs={24} sm={12} md={8} lg={8} xl={6}>
            <Card
              hoverable
              className="project-card h-full border-dashed"
              style={{ minHeight: 200 }}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <PlusOutlined className="text-3xl text-gray-400 mb-2" />
                <Text type="secondary">View All</Text>
                <Text type="secondary" className="text-xs">
                  {projects.length} projects total
                </Text>
              </div>
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};