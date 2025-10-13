import React, { useState } from 'react';
import { Card, Typography, Tag, Space, Button } from 'antd';
import { 
  BulbOutlined, 
  DownOutlined, 
  UpOutlined,
  FireOutlined,
  StarOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

export const InspirationPanel: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const hotTopics = [
    '#AutumnOutfit',
    '#CafeExplore', 
    '#SkincareFaves',
    '#WeekendVibes',
    '#FoodieDiary',
    '#BookClub',
    '#FitnessJourney',
    '#HomeFinds'
  ];
  
  const startingSentences = [
    'Hey guys! Today I want to share something amazing...',
    'I recently discovered this hidden gem...',
    'As someone who\'s experienced in..., I have to say...',
    'Who else knows about this? This is seriously...',
    'OMG! This is absolutely game-changing...',
    'Wait, don\'t tell me you don\'t know about...',
    'Let me talk about my recent obsession...',
    'Sharing this underrated but incredible...'
  ];
  
  return (
    <Card 
      className="mb-6 animate-fadeInUp"
      bodyStyle={{ padding: isExpanded ? '16px' : '12px' }}
    >
      <div 
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Space>
          <BulbOutlined className="text-yellow-500 text-xl" />
          <Text strong>AI Inspiration Assistant</Text>
        </Space>
        <Button 
          type="text" 
          icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      
      <div 
        className={`collapse-expand ${isExpanded ? 'mt-4' : ''}`}
        style={{ 
          maxHeight: isExpanded ? '400px' : '0',
          opacity: isExpanded ? 1 : 0
        }}
      >
        {/* Hot Topics */}
        <div className="mb-4">
          <Space className="mb-2">
            <FireOutlined className="text-red-500" />
            <Text strong>Trending Topics</Text>
          </Space>
          <div className="flex flex-wrap gap-2">
            {hotTopics.map(topic => (
              <Tag 
                key={topic} 
                color="magenta"
                className="cursor-pointer hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  // Can add click topic handler
                }}
              >
                {topic}
              </Tag>
            ))}
          </div>
        </div>
        
        {/* Suggested Openings */}
        <div>
          <Space className="mb-2">
            <StarOutlined className="text-yellow-500" />
            <Text strong>Popular Opening Lines</Text>
          </Space>
          <div className="space-y-2">
            {startingSentences.map((sentence, index) => (
              <div 
                key={index}
                className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  // Can add click sentence handler
                }}
              >
                <Text className="text-sm">• {sentence}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};